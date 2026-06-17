// Figma full-file API → 디자인 토큰 변환 (순수 함수 모듈, 부작용 없음).
//
// 이 레포의 Figma 파일은 스타일을 "라이브러리 퍼블리시"하지 않고 로컬 스타일로만 둔다
// (퍼블리시 스타일 전용 /v1/files/:key/styles 는 0개를 돌려줌). 그래서 full-file
// 응답(document 트리 + file.styles 로컬 스타일 맵)에서 직접 토큰을 해석한다:
//   - 타이포: 로컬 TEXT 스타일을, 그 스타일을 참조하는 노드의 style 값으로 해석
//   - 색: FILL 스타일이 있으면 이름과 함께, 없으면 지정 페이지의 raw SOLID fill에서 팔레트 도출
//   - effect: 문서 전체 노드에서 그림자(DROP/INNER) 스캔 — 드리프트 판정의 실증 근거
//
// 결정성: 모든 출력 배열은 정렬, 타임스탬프 미포함 — "재추출 → git diff"가 의미 있는
// 드리프트만 보여주도록. CLI(scripts/extract-figma-tokens.ts)가 fetch·파일 I/O를 담당.

// ─── Figma API 입력 타입 (필요한 최소 부분집합) ───

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type FigmaStyleType = 'FILL' | 'TEXT' | 'EFFECT' | 'GRID';

export interface FigmaPaint {
  type: string; // 'SOLID' | 'GRADIENT_LINEAR' | ...
  visible?: boolean;
  opacity?: number;
  color?: FigmaColor;
}

export interface FigmaTypeStyle {
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: number;
  lineHeightPx?: number;
  letterSpacing?: number;
}

export interface FigmaEffect {
  type: string; // 'DROP_SHADOW' | 'INNER_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR'
  visible?: boolean;
  color?: FigmaColor;
  offset?: { x: number; y: number };
  radius?: number;
  spread?: number;
}

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  fills?: FigmaPaint[];
  style?: FigmaTypeStyle; // TEXT 노드
  effects?: FigmaEffect[];
  styles?: Record<string, string>; // 스타일 참조: { text?, fill?, fills?, effect? } -> styleId
  children?: FigmaNode[];
}

export interface FigmaStyleEntry {
  key?: string;
  name: string;
  styleType: FigmaStyleType;
  description?: string;
}

export type FigmaStylesMap = Record<string, FigmaStyleEntry>;

// ─── 토큰 출력 타입 ───

export interface ColorToken {
  name: string;
  hex: string;
  opacity?: number; // 1 미만일 때만
  source?: 'style' | 'raw'; // style=Figma 색 스타일(이름 있음), raw=페이지 fill에서 도출
  description?: string;
}

export interface TypographyToken {
  name: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  lineHeightPx?: number;
  letterSpacing?: number;
  description?: string;
}

export interface EffectDetail {
  type: string;
  color?: string;
  offset?: { x: number; y: number };
  radius?: number;
  spread?: number;
}

export interface EffectToken {
  name: string;
  boxShadow: string | null; // DROP/INNER_SHADOW의 CSS, blur 전용이면 null
  effects: EffectDetail[];
  description?: string;
}

export interface DesignTokens {
  source: { fileKey: string; figmaFile?: string };
  colors: ColorToken[];
  typography: TypographyToken[];
  effects: EffectToken[];
  notes: string[];
}

// ─── 색·effect 변환 (순수) ───

function channelToHex(c: number): string {
  const v = Math.max(0, Math.min(255, Math.round(c * 255)));
  return v.toString(16).padStart(2, '0');
}

export function figmaColorToHex(color: FigmaColor): string {
  return `#${channelToHex(color.r)}${channelToHex(color.g)}${channelToHex(color.b)}`;
}

function round(n: number, digits = 3): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

export function figmaColorToRgba(color: FigmaColor, opacity = 1): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const a = round(color.a * opacity, 3);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function effectToCss(effect: FigmaEffect): string | null {
  if (effect.type !== 'DROP_SHADOW' && effect.type !== 'INNER_SHADOW') return null;
  const x = effect.offset?.x ?? 0;
  const y = effect.offset?.y ?? 0;
  const blur = effect.radius ?? 0;
  const spread = effect.spread ?? 0;
  const color = effect.color ? figmaColorToRgba(effect.color) : 'rgba(0, 0, 0, 1)';
  const inset = effect.type === 'INNER_SHADOW' ? 'inset ' : '';
  return `${inset}${x}px ${y}px ${blur}px ${spread}px ${color}`;
}

function effectDetail(e: FigmaEffect): EffectDetail {
  const d: EffectDetail = { type: e.type };
  if (e.color) d.color = figmaColorToRgba(e.color);
  if (e.offset) d.offset = e.offset;
  if (e.radius !== undefined) d.radius = e.radius;
  if (e.spread !== undefined) d.spread = e.spread;
  return d;
}

function firstSolidPaint(fills?: FigmaPaint[]): FigmaPaint | undefined {
  return fills?.find((p) => p.visible !== false && p.type === 'SOLID' && p.color);
}

// ─── 트리 순회 ───

export function collectNodes(root: FigmaNode): FigmaNode[] {
  const out: FigmaNode[] = [];
  const rec = (n: FigmaNode): void => {
    out.push(n);
    (n.children ?? []).forEach(rec);
  };
  rec(root);
  return out;
}

export function nodesUnderPage(document: FigmaNode, pageName: string): FigmaNode[] {
  const page = (document.children ?? []).find((p) => p.name === pageName);
  return page ? collectNodes(page) : [];
}

// ─── 빌더 ───

/** 로컬 TEXT 스타일을, 그 스타일을 참조하는 첫 노드의 style 값으로 해석. */
export function buildTypography(stylesMap: FigmaStylesMap, nodes: FigmaNode[]): TypographyToken[] {
  const byStyleId: Record<string, FigmaNode> = {};
  for (const n of nodes) {
    const ref = n.styles?.text;
    if (ref && !byStyleId[ref] && n.style) byStyleId[ref] = n;
  }
  return Object.keys(stylesMap)
    .filter((id) => stylesMap[id].styleType === 'TEXT')
    .map((id): TypographyToken | null => {
      const st = byStyleId[id]?.style;
      if (!st) return null;
      const t: TypographyToken = { name: stylesMap[id].name };
      if (st.fontFamily !== undefined) t.fontFamily = st.fontFamily;
      if (st.fontSize !== undefined) t.fontSize = st.fontSize;
      if (st.fontWeight !== undefined) t.fontWeight = st.fontWeight;
      if (st.lineHeightPx !== undefined) t.lineHeightPx = round(st.lineHeightPx, 2);
      if (st.letterSpacing !== undefined) t.letterSpacing = round(st.letterSpacing, 3);
      if (stylesMap[id].description) t.description = stylesMap[id].description;
      return t;
    })
    .filter((t): t is TypographyToken => t !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Figma FILL 스타일(이름 있음)을 참조 노드의 fill에서 해석. */
export function buildNamedColors(stylesMap: FigmaStylesMap, nodes: FigmaNode[]): ColorToken[] {
  const byStyleId: Record<string, FigmaPaint> = {};
  for (const n of nodes) {
    const ref = n.styles?.fill ?? n.styles?.fills;
    if (ref && !byStyleId[ref]) {
      const p = firstSolidPaint(n.fills);
      if (p?.color) byStyleId[ref] = p;
    }
  }
  return Object.keys(stylesMap)
    .filter((id) => stylesMap[id].styleType === 'FILL')
    .map((id): ColorToken | null => {
      const p = byStyleId[id];
      if (!p?.color) return null;
      const opacity = round(p.color.a * (p.opacity ?? 1), 3);
      const c: ColorToken = { name: stylesMap[id].name, hex: figmaColorToHex(p.color), source: 'style' };
      if (opacity < 1) c.opacity = opacity;
      if (stylesMap[id].description) c.description = stylesMap[id].description;
      return c;
    })
    .filter((c): c is ColorToken => c !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** 색 스타일이 없을 때, 노드들의 raw SOLID fill에서 고유 색 팔레트 도출(이름=hex). */
export function buildPalette(nodes: FigmaNode[]): ColorToken[] {
  const seen = new Map<string, ColorToken>();
  for (const n of nodes) {
    for (const p of n.fills ?? []) {
      if (p.type !== 'SOLID' || p.visible === false || !p.color) continue;
      const hex = figmaColorToHex(p.color);
      const opacity = round(p.color.a * (p.opacity ?? 1), 3);
      const key = `${hex}@${opacity}`;
      if (seen.has(key)) continue;
      // 같은 hex가 여러 불투명도로 쓰이면(예: 텍스트 강조 단계) 이름에 %를 붙여 구분.
      const c: ColorToken = { name: opacity < 1 ? `${hex} @${Math.round(opacity * 100)}%` : hex, hex, source: 'raw' };
      if (opacity < 1) c.opacity = opacity;
      seen.set(key, c);
    }
  }
  return [...seen.values()].sort(
    (a, b) => a.hex.localeCompare(b.hex) || (a.opacity ?? 1) - (b.opacity ?? 1),
  );
}

/** 로컬 EFFECT 스타일을 참조 노드의 effects에서 해석. */
export function buildNamedEffects(stylesMap: FigmaStylesMap, nodes: FigmaNode[]): EffectToken[] {
  const byStyleId: Record<string, FigmaNode> = {};
  for (const n of nodes) {
    const ref = n.styles?.effect;
    if (ref && !byStyleId[ref] && n.effects?.length) byStyleId[ref] = n;
  }
  return Object.keys(stylesMap)
    .filter((id) => stylesMap[id].styleType === 'EFFECT')
    .map((id): EffectToken | null => toEffectToken(stylesMap[id].name, byStyleId[id]?.effects))
    .filter((e): e is EffectToken => e !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** 문서 전체에서 보이는 그림자(DROP/INNER)를 스캔 — boxShadow 기준 중복 제거. */
export function scanShadows(nodes: FigmaNode[]): EffectToken[] {
  const seen = new Map<string, EffectToken>();
  for (const n of nodes) {
    const token = toEffectToken(n.name, n.effects);
    if (token?.boxShadow && !seen.has(token.boxShadow)) seen.set(token.boxShadow, token);
  }
  return [...seen.values()].sort((a, b) => (a.boxShadow ?? '').localeCompare(b.boxShadow ?? ''));
}

function toEffectToken(name: string, effects?: FigmaEffect[]): EffectToken | null {
  const raw = (effects ?? []).filter(
    (e) => (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW') && e.visible !== false,
  );
  if (raw.length === 0) return null;
  const css = raw.map(effectToCss).filter((c): c is string => c !== null).join(', ');
  return { name, boxShadow: css === '' ? null : css, effects: raw.map(effectDetail) };
}

export function buildTokensFromFile(args: {
  fileKey: string;
  figmaFile?: string;
  document: FigmaNode;
  stylesMap: FigmaStylesMap;
  palettePage?: string;
}): DesignTokens {
  const { fileKey, figmaFile, document, stylesMap, palettePage } = args;
  const allNodes = collectNodes(document);

  const typography = buildTypography(stylesMap, allNodes);

  const namedColors = buildNamedColors(stylesMap, allNodes);
  const paletteNodes = palettePage ? nodesUnderPage(document, palettePage) : [];
  const colors =
    namedColors.length > 0 ? namedColors : buildPalette(paletteNodes.length > 0 ? paletteNodes : allNodes);

  // 이름 있는 effect 스타일 + raw 그림자 스캔을 boxShadow 기준으로 병합/중복제거.
  const effMap = new Map<string, EffectToken>();
  for (const e of [...buildNamedEffects(stylesMap, allNodes), ...scanShadows(allNodes)]) {
    const k = e.boxShadow ?? e.name;
    if (!effMap.has(k)) effMap.set(k, e);
  }
  const effects = [...effMap.values()].sort((a, b) => a.name.localeCompare(b.name));

  const notes: string[] = [
    namedColors.length > 0
      ? '색: Figma FILL 스타일에서 추출(의미명 있음).'
      : `색: Figma 색 스타일이 없어 ${palettePage ?? '문서'} 페이지의 raw SOLID fill에서 팔레트를 도출했다(이름=hex). 색 스타일을 만들면 의미명으로 대체된다.`,
    `effect: 문서 전체 노드에서 그림자(DROP/INNER_SHADOW)를 스캔 — ${effects.length}개.`,
    'radius·spacing 토큰은 Figma Variables API(Enterprise 전용)에서만 추출 가능 — 미포함.',
  ];

  return {
    source: figmaFile ? { fileKey, figmaFile } : { fileKey },
    colors,
    typography,
    effects,
    notes,
  };
}

// ─── design.md 생성 ───

function colorRow(c: ColorToken): string {
  return `| ${c.name} | \`${c.hex}\` | ${c.opacity ?? '—'} | ${c.source ?? '—'} | ${c.description ?? ''} |`;
}

function typographyRow(t: TypographyToken): string {
  return `| ${t.name} | ${t.fontFamily ?? '—'} | ${t.fontSize ?? '—'} | ${t.fontWeight ?? '—'} | ${t.lineHeightPx ?? '—'} | ${t.letterSpacing ?? '—'} |`;
}

function effectRow(e: EffectToken): string {
  return `| ${e.name} | \`${e.boxShadow ?? '(blur)'}\` |`;
}

export function tokensToMarkdown(tokens: DesignTokens): string {
  const lines: string[] = [];
  lines.push('# HAJA Design Tokens');
  lines.push('');
  lines.push(
    `> 자동 생성 — \`yarn figma:extract\`로 Figma(파일 \`${tokens.source.fileKey}\`${tokens.source.figmaFile ? `, "${tokens.source.figmaFile}"` : ''})에서 추출. **직접 편집 금지.**`,
  );
  lines.push('> 디자인 변경은 Figma에서 한 뒤 재추출하고 git diff로 리뷰한다. (진실 소스 = Figma)');
  lines.push('');

  lines.push(`## Colors (${tokens.colors.length})`);
  lines.push('');
  if (tokens.colors.length === 0) {
    lines.push('_추출된 색 없음._');
  } else {
    lines.push('| 이름 | Hex | Opacity | 출처 | 설명 |');
    lines.push('|------|-----|---------|------|------|');
    tokens.colors.forEach((c) => lines.push(colorRow(c)));
  }
  lines.push('');

  lines.push(`## Typography (${tokens.typography.length})`);
  lines.push('');
  if (tokens.typography.length === 0) {
    lines.push('_추출된 텍스트 스타일 없음._');
  } else {
    lines.push('| 이름 | Font | Size | Weight | Line Height | Letter Spacing |');
    lines.push('|------|------|------|--------|-------------|----------------|');
    tokens.typography.forEach((t) => lines.push(typographyRow(t)));
  }
  lines.push('');

  lines.push(`## Effects / Shadows (${tokens.effects.length})`);
  lines.push('');
  if (tokens.effects.length === 0) {
    lines.push(
      '_문서 전체 노드를 스캔했으나 그림자(effect)가 없음 — 플랫·무그림자 디자인 언어. 코드의 `shadow-*` 사용은 드리프트이며 가드 대상이다._',
    );
  } else {
    lines.push('| 이름 | box-shadow |');
    lines.push('|------|-----------|');
    tokens.effects.forEach((e) => lines.push(effectRow(e)));
  }
  lines.push('');

  if (tokens.notes.length > 0) {
    lines.push('## 비고');
    lines.push('');
    tokens.notes.forEach((n) => lines.push(`- ${n}`));
    lines.push('');
  }

  return lines.join('\n');
}
