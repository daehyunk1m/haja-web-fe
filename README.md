# HAJA - 불렛 저널 웹 애플리케이션

React + TypeScript + Vite 기반의 불렛 저널 웹 애플리케이션입니다.

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- Yarn 또는 npm

### 설치 및 실행

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev
```

## 🔐 인증 설정 (Supabase)

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에서 새 프로젝트를 생성합니다.
2. 프로젝트 설정에서 URL과 anon key를 확인합니다.

### 2. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수들을 설정합니다:

```env
# Supabase 설정
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 기타 설정
VITE_APP_URL=http://localhost:5173
```

### 3. Google OAuth 설정

1. Supabase 대시보드에서 Authentication > Providers로 이동
2. Google provider를 활성화
3. Google Cloud Console에서 OAuth 2.0 클라이언트 ID와 시크릿을 생성
4. Supabase에 클라이언트 ID와 시크릿을 입력
5. 리다이렉트 URL을 `https://your-project.supabase.co/auth/v1/callback`로 설정

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
├── contexts/           # React Context
├── hooks/              # 커스텀 훅
├── lib/                # 유틸리티 및 설정
├── pages/              # 페이지 컴포넌트
├── shared/             # 공유 상태 및 타입
└── utils/              # 유틸리티 함수
```

## 🛠 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Authentication**: Supabase Auth
- **UI Components**: Radix UI, Lucide React
- **Form Handling**: React Hook Form + Zod
- **Testing**: Vitest, React Testing Library

## 🔧 개발 가이드

### 코드 스타일

- TypeScript strict 모드 사용
- 함수형 컴포넌트와 훅 사용
- Tailwind CSS로 스타일링
- ESLint 규칙 준수

### 인증 플로우

1. 사용자가 로그인 페이지에서 Google 로그인 버튼 클릭
2. Supabase OAuth 플로우를 통해 Google 인증
3. 인증 성공 시 `/auth/callback`으로 리다이렉트
4. 세션 확인 후 메인 페이지로 이동

## 📝 라이센스

MIT License

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
