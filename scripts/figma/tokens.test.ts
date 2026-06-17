import { describe, it, expect } from 'vitest';
import {
  buildNamedColors,
  buildPalette,
  buildTokensFromFile,
  buildTypography,
  collectNodes,
  effectToCss,
  figmaColorToHex,
  figmaColorToRgba,
  nodesUnderPage,
  scanShadows,
  tokensToMarkdown,
  type FigmaNode,
  type FigmaStylesMap,
} from './tokens';

describe('figmaColorToHex / rgba', () => {
  it('흰색·검정·반올림·패딩', () => {
    expect(figmaColorToHex({ r: 1, g: 1, b: 1, a: 1 })).toBe('#ffffff');
    expect(figmaColorToHex({ r: 0, g: 0, b: 0, a: 1 })).toBe('#000000');
    expect(figmaColorToHex({ r: 0.5, g: 0, b: 0, a: 1 })).toBe('#800000'); // 127.5→128
    expect(figmaColorToHex({ r: 1 / 255, g: 0, b: 0, a: 1 })).toBe('#010000');
    // 0.94*255 = 239.7 → 240 → f0  (haja의 #f0f0f0)
    expect(figmaColorToHex({ r: 0.94, g: 0.94, b: 0.94, a: 1 })).toBe('#f0f0f0');
  });

  it('rgba는 color.a * paint opacity', () => {
    expect(figmaColorToRgba({ r: 0, g: 0, b: 0, a: 1 }, 0.5)).toBe('rgba(0, 0, 0, 0.5)');
  });
});

describe('effectToCss', () => {
  it('DROP/INNER_SHADOW → box-shadow, blur → null', () => {
    expect(
      effectToCss({ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.25 }, offset: { x: 0, y: 2 }, radius: 4, spread: 0 }),
    ).toBe('0px 2px 4px 0px rgba(0, 0, 0, 0.25)');
    expect(
      effectToCss({ type: 'INNER_SHADOW', color: { r: 0, g: 0, b: 0, a: 1 }, offset: { x: 1, y: 1 }, radius: 2 }),
    ).toBe('inset 1px 1px 2px 0px rgba(0, 0, 0, 1)');
    expect(effectToCss({ type: 'LAYER_BLUR', radius: 4 })).toBeNull();
  });
});

describe('트리 순회', () => {
  const doc: FigmaNode = {
    id: '0', name: 'Document', type: 'DOCUMENT',
    children: [
      { id: 'p1', name: 'main', type: 'CANVAS', children: [{ id: 'a', name: 'a', type: 'FRAME' }] },
      { id: 'p2', name: 'designSystem', type: 'CANVAS', children: [{ id: 'b', name: 'b', type: 'RECTANGLE' }] },
    ],
  };
  it('collectNodes는 pre-order로 전부', () => {
    expect(collectNodes(doc).map((n) => n.id)).toEqual(['0', 'p1', 'a', 'p2', 'b']);
  });
  it('nodesUnderPage는 해당 페이지만', () => {
    expect(nodesUnderPage(doc, 'designSystem').map((n) => n.id)).toEqual(['p2', 'b']);
    expect(nodesUnderPage(doc, '없는페이지')).toEqual([]);
  });
});

describe('buildTypography — 로컬 스타일 해석', () => {
  const stylesMap: FigmaStylesMap = {
    S1: { name: 'Body 1/Medium', styleType: 'TEXT' },
    S2: { name: 'Display 1/Bold', styleType: 'TEXT' },
    SF: { name: 'Primary', styleType: 'FILL' }, // TEXT 아님 → 무시
  };
  const nodes: FigmaNode[] = [
    { id: '1', name: 'body', type: 'TEXT', styles: { text: 'S1' }, style: { fontFamily: 'Pretendard', fontSize: 16, fontWeight: 400, lineHeightPx: 19.1, letterSpacing: 0 } },
    { id: '2', name: 'display', type: 'TEXT', styles: { text: 'S2' }, style: { fontFamily: 'DM Sans', fontSize: 32, fontWeight: 900, lineHeightPx: 41.7, letterSpacing: -0.96 } },
  ];
  it('참조 노드의 style 값으로 해석, 이름 정렬', () => {
    expect(buildTypography(stylesMap, nodes)).toEqual([
      { name: 'Body 1/Medium', fontFamily: 'Pretendard', fontSize: 16, fontWeight: 400, lineHeightPx: 19.1, letterSpacing: 0 },
      { name: 'Display 1/Bold', fontFamily: 'DM Sans', fontSize: 32, fontWeight: 900, lineHeightPx: 41.7, letterSpacing: -0.96 },
    ]);
  });
  it('참조 노드가 없는 스타일은 스킵', () => {
    expect(buildTypography({ X: { name: '미사용', styleType: 'TEXT' } }, nodes)).toEqual([]);
  });
});

describe('색 — 스타일 우선, 없으면 raw 팔레트', () => {
  it('buildNamedColors: FILL 스타일을 참조 노드 fill에서 해석', () => {
    const stylesMap: FigmaStylesMap = { F1: { name: 'Primary/Black', styleType: 'FILL' } };
    const nodes: FigmaNode[] = [
      { id: '1', name: 'r', type: 'RECTANGLE', styles: { fill: 'F1' }, fills: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 1 } }] },
    ];
    expect(buildNamedColors(stylesMap, nodes)).toEqual([{ name: 'Primary/Black', hex: '#000000', source: 'style' }]);
  });

  it('buildPalette: raw SOLID fill 고유색, hex→opacity 정렬, 불투명도는 이름에 %', () => {
    const nodes: FigmaNode[] = [
      { id: '1', name: 'black', type: 'RECTANGLE', fills: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 1 } }] },
      { id: '2', name: 'black2', type: 'RECTANGLE', fills: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 1 } }] }, // 중복
      { id: '2b', name: 'black50', type: 'RECTANGLE', fills: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 0.5 } }] }, // 같은 hex 다른 불투명도
      { id: '3', name: 'white', type: 'RECTANGLE', fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 1 } }] },
      { id: '4', name: 'gray', type: 'RECTANGLE', fills: [{ type: 'SOLID', color: { r: 0.94, g: 0.94, b: 0.94, a: 1 } }] },
      { id: '5', name: 'grad', type: 'RECTANGLE', fills: [{ type: 'GRADIENT_LINEAR' }] }, // SOLID 아님 → 제외
    ];
    expect(buildPalette(nodes)).toEqual([
      { name: '#000000 @50%', hex: '#000000', source: 'raw', opacity: 0.5 },
      { name: '#000000', hex: '#000000', source: 'raw' },
      { name: '#f0f0f0', hex: '#f0f0f0', source: 'raw' },
      { name: '#ffffff', hex: '#ffffff', source: 'raw' },
    ]);
  });
});

describe('scanShadows — 문서 전체 그림자 스캔', () => {
  it('보이는 그림자를 boxShadow 기준 중복제거', () => {
    const nodes: FigmaNode[] = [
      { id: '1', name: 'card', type: 'FRAME', effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 1 }, radius: 3, spread: 0 }] },
      { id: '2', name: 'card2', type: 'FRAME', effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 1 }, radius: 3, spread: 0 }] }, // 동일 → 1개
    ];
    const out = scanShadows(nodes);
    expect(out).toHaveLength(1);
    expect(out[0].boxShadow).toBe('0px 1px 3px 0px rgba(0, 0, 0, 0.1)');
  });
  it('그림자 없으면 빈 배열 (무그림자 신호)', () => {
    expect(scanShadows([{ id: '1', name: 'x', type: 'FRAME' }])).toEqual([]);
  });
});

describe('buildTokensFromFile — haja 형태 통합', () => {
  // 실제 파일 구조 미러: 로컬 TEXT 스타일 + designSystem 페이지 raw 흑백 + 그림자 0
  const document: FigmaNode = {
    id: '0', name: 'Document', type: 'DOCUMENT',
    children: [
      { id: 'p-main', name: 'main', type: 'CANVAS', children: [
        { id: 't', name: 'title', type: 'TEXT', styles: { text: 'S1' }, style: { fontFamily: 'Pretendard', fontSize: 16, fontWeight: 400 } },
      ] },
      { id: 'p-ds', name: 'designSystem', type: 'CANVAS', children: [
        { id: 'c1', name: 'black', type: 'RECTANGLE', fills: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 1 } }] },
        { id: 'c2', name: 'white', type: 'RECTANGLE', fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 1 } }] },
      ] },
    ],
  };
  const stylesMap: FigmaStylesMap = { S1: { name: 'Body 1/Medium', styleType: 'TEXT' } };

  it('타이포=로컬스타일, 색=designSystem 팔레트(raw), effect=0', () => {
    const tokens = buildTokensFromFile({ fileKey: 'K', figmaFile: 'haja', document, stylesMap, palettePage: 'designSystem' });
    expect(tokens.source).toEqual({ fileKey: 'K', figmaFile: 'haja' });
    expect(tokens.typography).toEqual([{ name: 'Body 1/Medium', fontFamily: 'Pretendard', fontSize: 16, fontWeight: 400 }]);
    expect(tokens.colors).toEqual([
      { name: '#000000', hex: '#000000', source: 'raw' },
      { name: '#ffffff', hex: '#ffffff', source: 'raw' },
    ]);
    expect(tokens.effects).toEqual([]);
    expect(tokens.notes.some((n) => n.includes('raw SOLID fill'))).toBe(true);
  });

  it('FILL 스타일이 있으면 raw 팔레트 대신 이름 있는 색 사용', () => {
    const withFillStyle = { ...stylesMap, F1: { name: 'Brand/Primary', styleType: 'FILL' as const } };
    const docWithFill: FigmaNode = {
      ...document,
      children: [
        ...(document.children ?? []),
        { id: 'p-x', name: 'x', type: 'CANVAS', children: [
          { id: 'fx', name: 'fx', type: 'RECTANGLE', styles: { fill: 'F1' }, fills: [{ type: 'SOLID', color: { r: 0.1, g: 0.2, b: 0.3, a: 1 } }] },
        ] },
      ],
    };
    const tokens = buildTokensFromFile({ fileKey: 'K', document: docWithFill, stylesMap: withFillStyle, palettePage: 'designSystem' });
    expect(tokens.colors).toEqual([{ name: 'Brand/Primary', hex: '#1a334d', source: 'style' }]);
  });
});

describe('tokensToMarkdown', () => {
  it('색 hex·자동생성 경고·무그림자 명시', () => {
    const tokens = buildTokensFromFile({
      fileKey: 'ABC', figmaFile: 'haja', palettePage: 'designSystem',
      stylesMap: {},
      document: { id: '0', name: 'd', type: 'DOCUMENT', children: [
        { id: 'p', name: 'designSystem', type: 'CANVAS', children: [
          { id: 'r', name: 'r', type: 'RECTANGLE', fills: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 1 } }] },
        ] },
      ] },
    });
    const md = tokensToMarkdown(tokens);
    expect(md).toContain('# HAJA Design Tokens');
    expect(md).toContain('직접 편집 금지');
    expect(md).toContain('`#000000`');
    expect(md).toContain('Effects / Shadows (0)');
    expect(md).toContain('가드 대상');
  });
});
