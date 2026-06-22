// Figma → 디자인 토큰 추출 CLI.
//
// 사용법:
//   yarn figma:extract                         # 기본 파일키(HAJA) 사용
//   yarn figma:extract <fileKey | figmaURL>    # 다른 파일 지정
//
// 인증: 읽기전용 Personal Access Token을 .env 의 FIGMA_TOKEN 에 둔다 (커밋 금지 — .env는 gitignore).
//   FIGMA_TOKEN=figd_xxx
//
// 이 파일은 fetch·파일 I/O만 담당(인프라). 변환 로직은 ./figma/tokens (유닛 테스트됨).
// 퍼블리시 스타일이 아니라 full-file 응답(document + 로컬 styles 맵)에서 토큰을 해석한다.
//
// 산출물: tokens.json (레포 루트) + docs/design-docs/design.md

import * as fs from 'fs';
import * as path from 'path';
import { buildTokensFromFile, tokensToMarkdown } from './figma/tokens';
import type { FigmaNode, FigmaStylesMap } from './figma/tokens';

const FIGMA_API = 'https://api.figma.com/v1';
const DEFAULT_FILE_KEY = 'gEWbtX9XnpzkHc9eVpv4j5'; // haja
const PALETTE_PAGE = process.env.FIGMA_PALETTE_PAGE || 'designSystem';
const TOKENS_OUT = 'tokens.json';
const DESIGN_OUT = path.join('docs', 'design-docs', 'design.md');

function loadToken(): string | undefined {
  if (process.env.FIGMA_TOKEN) return process.env.FIGMA_TOKEN.trim();
  for (const envFile of ['.env', '.env.local']) {
    if (!fs.existsSync(envFile)) continue;
    const m = fs.readFileSync(envFile, 'utf-8').match(/^\s*FIGMA_TOKEN\s*=\s*(.+?)\s*$/m);
    if (m) return m[1].replace(/^["']|["']$/g, '').trim();
  }
  return undefined;
}

function parseFileKey(input: string): string {
  const url = input.match(/figma\.com\/(?:file|design)\/([A-Za-z0-9]+)/);
  return url ? url[1] : input.trim();
}

async function figmaGet<T>(endpoint: string, token: string): Promise<T> {
  const res = await fetch(`${FIGMA_API}${endpoint}`, { headers: { 'X-Figma-Token': token } });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Figma API ${res.status} ${res.statusText} — ${endpoint}\n${body.slice(0, 300)}`);
  }
  return res.json() as Promise<T>;
}

const MISSING_TOKEN_HELP = `
❌ FIGMA_TOKEN 이 없습니다.

  1. https://www.figma.com/developers/api#access-tokens 에서 읽기전용 PAT 발급
     (Settings → Security → Personal access tokens → Generate, scope: File content read-only)
  2. 레포 루트 .env 에 추가 (커밋되지 않음):
       FIGMA_TOKEN=figd_xxxxx
  3. 다시 실행: yarn figma:extract
`;

interface FigmaFileResponse {
  name?: string;
  document: FigmaNode;
  styles?: FigmaStylesMap;
}

async function main(): Promise<void> {
  const token = loadToken();
  if (!token) {
    console.error(MISSING_TOKEN_HELP);
    process.exit(1);
  }

  const fileKey = parseFileKey(process.argv[2] || process.env.FIGMA_FILE_KEY || DEFAULT_FILE_KEY);
  console.log(`🎨 Figma 파일 ${fileKey} 추출 중 (full-file)...`);

  const file = await figmaGet<FigmaFileResponse>(`/files/${fileKey}`, token);
  const stylesMap = file.styles ?? {};
  console.log(`  파일 "${file.name ?? '?'}" · 로컬 스타일 ${Object.keys(stylesMap).length}개 · 팔레트 페이지 "${PALETTE_PAGE}"`);

  const tokens = buildTokensFromFile({
    fileKey,
    figmaFile: file.name,
    document: file.document,
    stylesMap,
    palettePage: PALETTE_PAGE,
  });

  fs.writeFileSync(TOKENS_OUT, JSON.stringify(tokens, null, 2) + '\n');
  fs.mkdirSync(path.dirname(DESIGN_OUT), { recursive: true });
  fs.writeFileSync(DESIGN_OUT, tokensToMarkdown(tokens));

  console.log(
    `✅ 추출 완료 — 색 ${tokens.colors.length} · 타이포 ${tokens.typography.length} · effect ${tokens.effects.length}`,
  );
  console.log(`   → ${TOKENS_OUT}`);
  console.log(`   → ${DESIGN_OUT}`);
  if (tokens.effects.length === 0) {
    console.log('   ℹ️  그림자 0개(문서 전체 스캔) = 무그림자 디자인 언어. 코드의 shadow-* 는 드리프트.');
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
