# HAJA Design Tokens

> 자동 생성 — `yarn figma:extract`로 Figma(파일 `gEWbtX9XnpzkHc9eVpv4j5`, "haja")에서 추출. **직접 편집 금지.**
> 디자인 변경은 Figma에서 한 뒤 재추출하고 git diff로 리뷰한다. (진실 소스 = Figma)

## Colors (7)

| 이름 | Hex | Opacity | 출처 | 설명 |
|------|-----|---------|------|------|
| #000000 @45% | `#000000` | 0.45 | raw |  |
| #000000 @50% | `#000000` | 0.5 | raw |  |
| #000000 @70% | `#000000` | 0.7 | raw |  |
| #000000 | `#000000` | — | raw |  |
| #d9d9d9 | `#d9d9d9` | — | raw |  |
| #f0f0f0 | `#f0f0f0` | — | raw |  |
| #ffffff | `#ffffff` | — | raw |  |

## Typography (8)

| 이름 | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Body 1/Medium | Pretendard | 16 | 400 | 19.09 | 0 |
| Caption 1/Medium | Pretendard | 12 | 600 | 14.32 | 0 |
| Display 1/Bold | DM Sans | 32 | 900 | 41.66 | -0.96 |
| Heading 1/Medium | Pretendard | 16 | 500 | 19.09 | 0 |
| Label 1/Medium | Pretendard | 14 | 500 | 16.71 | 0 |
| Title 1/Bold | DM Sans | 14 | 300 | 18.23 | 0.42 |
| Title 2/Bold | Pretendard | 16 | 700 | 19.09 | -0.48 |
| Title 2/Regular | Pretendard | 16 | 600 | 19.09 | -0.48 |

## Effects / Shadows (0)

_문서 전체 노드를 스캔했으나 그림자(effect)가 없음 — 플랫·무그림자 디자인 언어. 코드의 `shadow-*` 사용은 드리프트이며 가드 대상이다._

## 비고

- 색: Figma 색 스타일이 없어 designSystem 페이지의 raw SOLID fill에서 팔레트를 도출했다(이름=hex). 색 스타일을 만들면 의미명으로 대체된다.
- effect: 문서 전체 노드에서 그림자(DROP/INNER_SHADOW)를 스캔 — 0개.
- radius·spacing 토큰은 Figma Variables API(Enterprise 전용)에서만 추출 가능 — 미포함.
