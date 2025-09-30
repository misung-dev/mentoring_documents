# 멘토링 리팩토링 프로젝트

이 프로젝트는 멘티들을 위한 React 컴포넌트 리팩토링 연습용 저장소입니다.

## 프로젝트 구조

```
src/
├── components/
│   ├── BackofficeLogin/
│   │   └── BackofficeLoginModal.tsx    # 리팩토링 대상 컴포넌트
│   └── ui/                             # shadcn/ui 컴포넌트들
├── lib/
│   ├── apiUtils.ts                     # API 유틸리티 함수들
│   └── utils.ts                        # 공통 유틸리티 함수들
└── documents/                          # 멘토링 문서들
    ├── git-collaboration-commands.md
    ├── github-desktop-branch-guide.md
    ├── github-flow-guide.md
    └── prettier-eslint-setup.md
```

## 개발 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

#### 목(Mock) API 사용 (기본값)

```bash
npm run dev
# 또는 명시적으로
npm run dev:mock
```

#### 실제 API 사용

```bash
npm run dev:real
```

#### 환경변수 직접 설정

```bash
# .env.local 파일 생성
VITE_ENABLE_MSW=true
VITE_API_BASE_URL=https://your-api-server.com
```

### 3. 린트 검사

```bash
npm run lint
```

### 4. 코드 포맷팅

```bash
npm run format
```

## 리팩토링 목표

`BackofficeLoginModal.tsx` 컴포넌트를 다음과 같은 관점에서 리팩토링해보세요:

1. **컴포넌트 분리**: 단일 책임 원칙에 따라 컴포넌트를 작은 단위로 분리
2. **커스텀 훅 추출**: 로직을 재사용 가능한 커스텀 훅으로 분리
3. **타입 안전성 개선**: TypeScript 타입 정의 강화
4. **에러 처리 개선**: 사용자 친화적인 에러 처리 로직 구현
5. **접근성 개선**: 웹 접근성 가이드라인 준수
6. **성능 최적화**: 불필요한 리렌더링 방지

## 환경변수 설정

프로젝트에서 사용하는 환경변수들:

| 환경변수            | 기본값                        | 설명                                         |
| ------------------- | ----------------------------- | -------------------------------------------- |
| `VITE_ENABLE_MSW`   | `true` (기본 활성화)          | MSW 활성화 여부 (`false`로 설정 시 비활성화) |
| `VITE_API_BASE_URL` | `https://test.hodong-erp.com` | 실제 API 서버 URL                            |

## 테스트 계정

MSW(Mock Service Worker)를 사용한 테스트 API가 설정되어 있습니다. 다음 계정으로 로그인을 테스트할 수 있습니다:

| 이메일             | 비밀번호      | 역할          | 설명             |
| ------------------ | ------------- | ------------- | ---------------- |
| `admin@test.com`   | `password123` | admin, user   | 관리자 계정      |
| `manager@test.com` | `password123` | manager, user | 매니저 계정      |
| `user@test.com`    | `password123` | user          | 일반 사용자 계정 |

## 기술 스택

- **React 19** + **TypeScript**
- **Vite** (빌드 도구)
- **Radix UI** (접근성 중심 UI 라이브러리)
- **Lucide React** (아이콘)
- **MSW** (Mock Service Worker - API 모킹)
- **ESLint** + **Prettier** (코드 품질 관리)
