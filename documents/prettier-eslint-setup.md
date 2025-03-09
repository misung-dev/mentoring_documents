# Prettier와 ESLint 설정 가이드

## 목차

1. [소개](#1-소개)
2. [설치 및 초기 설정](#2-설치-및-초기-설정)
3. [ESLint 설정](#3-eslint-설정)
4. [Prettier 설정](#4-prettier-설정)
5. [VS Code 통합](#5-vs-code-통합)
6. [설정 옵션 상세 가이드](#6-설정-옵션-상세-가이드)
7. [실제 적용 예시](#7-실제-적용-예시)
8. [문제 해결 및 팁](#8-문제-해결-및-팁)

## 1. 소개

ESLint와 Prettier는 현대 JavaScript/TypeScript 개발에서 필수적인 도구입니다:

### 1.1 각 도구의 역할

- **ESLint**: 코드 품질 관리 및 잠재적 문제 검출

  - 코드 버그 사전 방지
  - 일관된 코딩 컨벤션 적용
  - 안티 패턴 감지

- **Prettier**: 일관된 코드 스타일 유지

  - 자동 코드 포맷팅
  - 팀 전체의 일관된 코드 스타일 보장
  - 불필요한 코드 스타일 논쟁 방지

- **함께 사용**: 더 나은 개발 경험과 코드 품질 보장

### 1.2 팀 프로젝트에서의 중요성

#### 코드 리뷰 효율성 향상

- **본질적인 리뷰에 집중**: 코드 스타일이나 포맷팅이 아닌 로직과 아키텍처에 집중
- **리뷰 시간 단축**: 일관된 코드 스타일로 인한 가독성 향상
- **불필요한 논쟁 방지**: 개인 취향에 따른 코드 스타일 논쟁 제거

#### 팀 생산성 향상

- **온보딩 시간 단축**: 새로운 팀원이 일관된 코드베이스에 빠르게 적응
- **유지보수성 향상**: 누가 작성했든 동일한 스타일의 코드로 유지
- **자동화된 품질 관리**: CI/CD 파이프라인에 통합하여 자동 검증

#### 코드 품질 개선

- **일관성**: 전체 프로젝트에서 일관된 코딩 패턴 유지
- **가독성**: 표준화된 포맷팅으로 코드 이해도 향상
- **버그 예방**: 정적 분석을 통한 잠재적 문제 조기 발견

### 1.3 도입 효과

- **개발 시간 단축**: 포맷팅에 들이는 시간 절약
- **협업 효율성**: 일관된 코드베이스로 팀 협업 향상
- **코드 품질**: 자동화된 품질 관리로 전반적인 코드 품질 향상
- **유지보수성**: 장기적인 프로젝트 유지보수 비용 절감

## 2. 설치 및 초기 설정

### 2.1 필요한 패키지 설치

```bash
# ESLint 관련 패키지
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Prettier 관련 패키지
npm install -D prettier eslint-config-prettier eslint-plugin-prettier

# React 관련 ESLint 플러그인
npm install -D eslint-plugin-react eslint-plugin-react-hooks
```

### 2.2 기본 스크립트 설정

`package.json`의 "scripts" 섹션에 다음 내용을 추가:

```json
{
  "scripts": {
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,css,md}\""
  }
}
```

### 2.3 Git 설정

`.gitignore` 파일에 다음 내용 추가:

```
node_modules
.DS_Store
dist
dist-ssr
*.local
.env
```

## 3. ESLint 설정

### 3.1 기본 설정

`.eslintrc.json` 파일을 프로젝트 루트에 생성하고 다음 내용을 추가:

```json
{
  // 실행 환경 설정: 전역 변수와 문법 지원 설정
  "env": {
    "browser": true, // window, document 등 브라우저 전역 변수 사용 가능
    "es2021": true, // ES2021 문법 지원 (async/await, optional chaining 등)
    "node": true // process, require 등 Node.js 전역 변수 사용 가능
  },

  // 규칙 세트 확장: 기본 규칙에 추가할 규칙 세트 설정
  "extends": [
    // JavaScript 기본 규칙 모음
    // - 잠재적 에러 방지 (예: no-undef, no-unreachable)
    // - 최선의 실천 방안 적용 (예: eqeqeq, no-eval)
    // - ES6+ 문법 관련 규칙 (예: arrow-spacing, no-var)
    "eslint:recommended",

    // TypeScript 특화 규칙 모음
    // - 타입 안정성 강화 (예: explicit-function-return-type)
    // - 타입스크립트 기능 활용 (예: no-unnecessary-type-assertion)
    // - 인터페이스/타입 사용 규칙 (예: consistent-type-definitions)
    "plugin:@typescript-eslint/recommended",

    // React 관련 규칙 모음
    // - JSX 문법 검사 (예: jsx-no-undef)
    // - 접근성 규칙 (예: jsx-a11y)
    // - React 컴포넌트 규칙 (예: react/prop-types)
    "plugin:react/recommended",

    // React Hooks 규칙 모음
    // - Hooks 사용 규칙 (예: rules-of-hooks)
    // - 의존성 배열 검사 (예: exhaustive-deps)
    // - 커스텀 Hooks 규칙 (예: hooks-naming-convention)
    "plugin:react-hooks/recommended",

    // Prettier 통합 설정
    // - ESLint와 Prettier 충돌 방지
    // - 코드 스타일 규칙을 Prettier에 위임
    // - 다른 스타일 관련 규칙 비활성화
    "plugin:prettier/recommended"
  ],

  // 파서 설정: 코드 분석기 설정
  "parser": "@typescript-eslint/parser", // TypeScript 코드 분석 파서
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true // JSX 구문 분석 활성화
    },
    "ecmaVersion": "latest", // 최신 ECMAScript 버전 사용
    "sourceType": "module" // import/export 구문 사용 가능
  },

  // 플러그인: 추가 규칙과 설정을 제공하는 플러그인 목록
  "plugins": [
    "react", // React 관련 규칙
    "@typescript-eslint", // TypeScript 관련 규칙
    "prettier" // Prettier 관련 규칙
  ],

  // 개별 규칙 설정: 세부적인 린트 규칙 설정
  "rules": {
    "react/react-in-jsx-scope": "off", // React 17+ 버전에서는 import React 불필요
    "prettier/prettier": "error", // Prettier 규칙 위반 시 에러 처리
    "no-console": "warn", // console.log() 사용 시 경고
    "no-unused-vars": "warn" // 사용하지 않는 변수 경고
  },

  // 기타 설정: 추가 설정 옵션
  "settings": {
    "react": {
      "version": "detect" // React 버전 자동 감지
    }
  }
}
```

### 3.2 규칙 설정

- `.eslintrc.json` 파일을 프로젝트 루트에 성공적으로 생성
- 주요 설정:
  - TypeScript와 React 지원 설정
  - Prettier와 통합 설정
  - React 17+ 버전을 위한 'react-in-jsx-scope' 규칙 비활성화

## 4. Prettier 설정

### 4.1 기본 설정

`.prettierrc` 파일을 프로젝트 루트에 생성하고 다음 내용을 추가:

```json
{
  // 기본 서식 설정
  "printWidth": 100, // 한 줄의 최대 길이 (100자)
  "tabWidth": 2, // 들여쓰기 간격 (2칸)
  "useTabs": false, // 탭 대신 공백 사용
  "semi": true, // 문장 끝에 세미콜론 추가

  // 따옴표 설정
  "singleQuote": true, // 작은따옴표 사용 ('string' vs "string")
  "jsxSingleQuote": false, // JSX에서는 큰따옴표 사용 (<div class="foo">)

  // 괄호와 쉼표 설정
  "bracketSpacing": true, // 객체 리터럴의 괄호 사이에 공백 추가 ({ foo: bar })
  "bracketSameLine": false, // JSX 요소의 > 를 다음 줄로 내림
  "arrowParens": "always", // 화살표 함수 매개변수 항상 괄호 사용 ((x) => x)
  "trailingComma": "all", // 객체/배열의 마지막 항목에 쉼표 추가

  // 파일 형식 설정
  "endOfLine": "lf", // 줄 끝 문자를 LF(\\n)로 통일
  "proseWrap": "preserve", // 마크다운 파일의 줄바꿈 보존

  // 특수 파일 설정
  "overrides": [
    {
      "files": "*.md", // 마크다운 파일 설정
      "options": {
        "proseWrap": "preserve"
      }
    }
  ]
}
```

## 5. VS Code 통합

### 5.1 필수 확장 프로그램

다음 VS Code 확장 프로그램을 반드시 설치해야 합니다:

- ESLint (`dbaeumer.vscode-eslint`): 코드 품질 검사 도구
- Prettier (`esbenp.prettier-vscode`): 코드 포맷팅 도구

### 5.2 작업 공간 설정

`.vscode/settings.json` 파일을 생성하고 다음 내용을 추가:

> 💡 **VS Code settings.json 여는 단축키**
>
> - Windows/Linux: `Ctrl + Shift + P` → "settings.json" 검색 또는 `Ctrl + ,` (설정 UI)
> - macOS: `Cmd + Shift + P` → "settings.json" 검색 또는 `Cmd + ,` (설정 UI)
>
> 작업 영역(Workspace) 설정을 열려면 "Workspace Settings"를 선택하세요.

```json
{
  // 에디터 기본 설정
  "editor.formatOnSave": true, // 저장 시 자동 포맷팅
  "editor.defaultFormatter": "esbenp.prettier-vscode", // 기본 포맷터로 Prettier 사용

  // ESLint 자동 수정 설정
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true // 저장 시 ESLint 문제 자동 수정
  },

  // 언어별 포맷터 설정
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode", // JavaScript 파일용 포맷터
    "editor.formatOnSave": true // JavaScript 파일 저장 시 포맷팅
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode", // TypeScript 파일용 포맷터
    "editor.formatOnSave": true // TypeScript 파일 저장 시 포맷팅
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode", // JSX 파일용 포맷터
    "editor.formatOnSave": true // JSX 파일 저장 시 포맷팅
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode", // TSX 파일용 포맷터
    "editor.formatOnSave": true // TSX 파일 저장 시 포맷팅
  },

  // ESLint 검사 대상 설정
  "eslint.validate": [
    "javascript", // JavaScript 파일 검사
    "javascriptreact", // JSX 파일 검사
    "typescript", // TypeScript 파일 검사
    "typescriptreact" // TSX 파일 검사
  ],

  // 추가 편집기 설정
  "editor.tabSize": 2, // 탭 크기 2칸으로 설정
  "files.eol": "\n", // 줄 끝 문자를 LF로 통일
  "files.insertFinalNewline": true // 파일 끝에 빈 줄 추가
}
```

이 설정을 통해:

1. 파일을 저장할 때마다 자동으로 포맷팅이 적용됩니다.
2. ESLint가 감지한 문제들이 자동으로 수정됩니다.
3. 각 파일 형식에 맞는 포맷터가 적용됩니다.

## 6. 설정 옵션 상세 가이드

### ESLint 설정 상세 (`.eslintrc.json`)

#### 1. 환경 설정 (`env`)

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  }
}
```

#### 2. 확장 설정 (`extends`)

```json
{
  "extends": [
    // JavaScript 기본 규칙 모음
    // - 잠재적 에러 방지 (예: no-undef, no-unreachable)
    // - 최선의 실천 방안 적용 (예: eqeqeq, no-eval)
    // - ES6+ 문법 관련 규칙 (예: arrow-spacing, no-var)
    "eslint:recommended",

    // TypeScript 특화 규칙 모음
    // - 타입 안정성 강화 (예: explicit-function-return-type)
    // - 타입스크립트 기능 활용 (예: no-unnecessary-type-assertion)
    // - 인터페이스/타입 사용 규칙 (예: consistent-type-definitions)
    "plugin:@typescript-eslint/recommended",

    // React 관련 규칙 모음
    // - JSX 문법 검사 (예: jsx-no-undef)
    // - 접근성 규칙 (예: jsx-a11y)
    // - React 컴포넌트 규칙 (예: react/prop-types)
    "plugin:react/recommended",

    // React Hooks 규칙 모음
    // - Hooks 사용 규칙 (예: rules-of-hooks)
    // - 의존성 배열 검사 (예: exhaustive-deps)
    // - 커스텀 Hooks 규칙 (예: hooks-naming-convention)
    "plugin:react-hooks/recommended",

    // Prettier 통합 설정
    // - ESLint와 Prettier 충돌 방지
    // - 코드 스타일 규칙을 Prettier에 위임
    // - 다른 스타일 관련 규칙 비활성화
    "plugin:prettier/recommended"
  ]
}
```

- 각 규칙 세트는 이전 규칙을 덮어쓸 수 있음
- 마지막에 오는 `prettier/recommended`가 스타일 관련 규칙을 최종 결정

#### 3. 파서 설정 (`parser` & `parserOptions`)

```json
{
  // TypeScript 파서 설정
  "parser": "@typescript-eslint/parser", // TypeScript 코드를 파싱하기 위한 파서

  // 파서 동작 옵션
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true // JSX 문법 파싱 활성화 (React 사용 시 필수)
    },
    "ecmaVersion": "latest", // 최신 ECMAScript 문법 지원
    "sourceType": "module" // ES Modules 방식 사용 (import/export 지원)
  }
}
```

#### 4. 자주 사용되는 규칙 설정 예시

```json
{
  "rules": {
    // React 관련 규칙
    "react/react-in-jsx-scope": "off", // React 17+ 버전에서는 import React 불필요
    "react/prop-types": "off", // TypeScript 사용 시 prop-types 체크 불필요
    "react-hooks/rules-of-hooks": "error", // Hooks 규칙 위반 시 에러
    "react-hooks/exhaustive-deps": "warn", // useEffect 의존성 배열 경고

    // 코드 품질 관련 규칙
    "no-console": "warn", // console.log() 사용 시 경고
    "no-unused-vars": "warn", // 사용하지 않는 변수 경고

    // Prettier 통합 규칙
    "prettier/prettier": "error" // Prettier 규칙 위반 시 에러
  }
}
```

### Prettier 설정 상세 (`.prettierrc`)

#### 1. 기본 포맷팅 설정

```json
{
  // 줄 길이 설정
  "printWidth": 100, // 한 줄의 최대 길이
  "tabWidth": 2, // 들여쓰기 간격
  "useTabs": false, // 탭 대신 공백 사용
  "semi": true, // 세미콜론 항상 추가

  // 따옴표 설정
  "singleQuote": true, // 작은따옴표 사용
  "jsxSingleQuote": false, // JSX에서는 큰따옴표 사용

  // 괄호와 쉼표 설정
  "bracketSpacing": true, // 객체 리터럴의 괄호 사이에 공백 추가
  "bracketSameLine": false, // JSX 닫는 괄호를 다음 줄로
  "arrowParens": "always", // 화살표 함수 매개변수 항상 괄호 사용
  "trailingComma": "all", // 여러 줄일 때 마지막 항목에 쉼표 추가

  // 파일 형식 설정
  "endOfLine": "lf", // 줄 끝 문자를 LF로 통일
  "proseWrap": "preserve" // 마크다운 텍스트 줄바꿈 보존
}
```

#### 2. JSX 관련 설정

```json
{
  "jsxSingleQuote": false, // JSX에서 큰따옴표 사용
  "bracketSpacing": true, // 객체 리터럴의 괄호 사이에 공백 추가
  "jsxBracketSameLine": false // JSX 닫는 괄호를 다음 줄로
}
```

#### 3. 자주 사용되는 추가 옵션

```json
{
  "arrowParens": "always", // 화살표 함수 매개변수 항상 괄호 사용
  "endOfLine": "lf", // 줄 끝 문자를 LF로 통일
  "useTabs": false, // 탭 대신 공백 사용
  "proseWrap": "preserve" // 마크다운 텍스트 줄바꿈 보존
}
```

### VS Code 통합 설정 상세 (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "editor.tabSize": 2,
  "files.eol": "\n",
  "files.insertFinalNewline": true
}
```

이러한 설정들은 프로젝트의 요구사항과 팀의 코딩 스타일에 따라 조정될 수 있습니다. 위 설정은 현대적인 React/TypeScript 프로젝트에서 널리 사용되는 기본 설정입니다.

## 7. 실제 적용 예시

### 7.1 변경 전/후 코드 비교

#### 변경 전 코드 (포맷팅 이슈가 있는 상태)

```tsx
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setState] = useState(0);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setState((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </div>
  );
}

export default App;
```

#### 변경 후 코드 (자동 포맷팅 적용)

```tsx
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setState] = useState(0);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setState((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </div>
  );
}

export default App;
```
