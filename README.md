# Next.js 관리자 대시보드

웹 기반 관리자 대시보드 애플리케이션입니다. Next.js 15와 Material-UI 7을 기반으로 구축되었으며, 사용자 인증, 권한 관리, FTP 파일 관리, 이메일 관리 등의 기능을 제공합니다.

## 🚀 주요 기능

### 🔐 인증 및 권한 관리

- **NextAuth.js 4** 기반 사용자 인증
- JWT 토큰 기반 세션 관리
- 역할 기반 접근 제어 (RBAC)
- 동적 메뉴 권한 관리

### 📁 파일 관리

- **FTP 파일 업로드/다운로드**
- 드래그 앤 드롭 파일 업로드
- 다중 파일 처리
- 파일 진행률 표시

### 📧 이메일 관리

- 이메일 전송 기능
- 파일 첨부 지원
- 템플릿 기반 이메일

### 👥 사용자 관리

- 사용자 등록/수정/삭제
- 권한 할당 및 관리
- 사용자 활성화/비활성화

### 🎨 관리자 인터페이스

- **Material-UI 7** 기반 현대적 UI
- 반응형 사이드바 네비게이션
- 동적 메뉴 시스템
- 테마 커스터마이징

## 🛠️ 기술 스택

### Frontend

- **Next.js 15.3.3** (App Router)
- **React 19** + **TypeScript 5**
- **Material-UI 7** + **Tailwind CSS 4**
- **Zustand 5** (상태 관리)

### Backend & API

- **Next.js API Routes**
- **React Query 5** (데이터 페칭)
- **Axios** (HTTP 클라이언트)
- **NextAuth.js 4** (인증)

### 개발 도구

- **ESLint** + **Prettier** (코드 품질)
- **Sass** (스타일링)
- **React Hook Form** + **Yup** (폼 처리)

## 📁 프로젝트 구조

```
src/
├── app/                    # App Router 페이지
│   ├── (auth)/            # 인증 관련 페이지
│   │   ├── login/         # 로그인
│   │   ├── register/      # 회원가입
│   │   ├── forgot-password/ # 비밀번호 찾기
│   │   └── reset-password/  # 비밀번호 재설정
│   ├── (main)/            # 메인 기능 페이지
│   │   ├── admin/         # 관리자 기능
│   │   │   ├── members/   # 회원 관리
│   │   │   ├── roles/     # 권한 관리
│   │   │   └── menu-resources/ # 메뉴 리소스 관리
│   │   ├── interface/     # 인터페이스
│   │   │   ├── ftp/       # FTP 파일 관리
│   │   │   └── email/     # 이메일 관리
│   │   └── main/          # 메인 대시보드
│   └── api/               # API 라우트
├── components/            # 재사용 가능한 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   ├── providers/        # Context Provider들
│   ├── interface/        # 인터페이스 컴포넌트
│   └── common/           # 공통 컴포넌트
├── hooks/                # 커스텀 훅
├── services/             # API 서비스
│   ├── admin/           # 관리자 서비스
│   ├── menu/            # 메뉴 서비스
│   ├── email/           # 이메일 서비스
│   └── inter/           # 인터페이스 서비스
├── stores/               # Zustand 스토어
├── types/                # TypeScript 타입 정의
├── utils/                # 유틸리티 함수
└── middleWares/          # 미들웨어
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- pnpm (권장) 또는 npm

### 설치 및 실행

1. **의존성 설치**

```bash
pnpm install
# 또는
npm install
```

2. **개발 서버 실행**

```bash
pnpm dev
# 또는
npm run dev
```

3. **빌드**

```bash
pnpm build
# 또는
npm run build
```

4. **프로덕션 실행**

```bash
pnpm start
# 또는
npm start
```

## 🔧 환경 설정

### 환경 변수

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# 스프링 url
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXTAUTH_URL=http://localhost:3000

# 로거 레벨 debug | info | warn | error
# 개발환경
NEXT_PUBLIC_LOG_LEVEL=debug
NEXT_PUBLIC_MIDDLEWARE_LOG=false
NEXT_PUBLIC_AUTH_LOG=false

# 프로덕션 (주석 처리)
# NEXT_PUBLIC_LOG_LEVEL=warn
# NEXT_PUBLIC_MIDDLEWARE_LOG=false
# NEXT_PUBLIC_AUTH_LOG=false
```

```env.local
# NextAuth 시크릿 (필수)
NEXTAUTH_SECRET=<시크릿키>

# OAuth 설정 (사용하는 서비스만)
GOOGLE_CLIENT_ID=<구글 아이디>
GOOGLE_CLIENT_SECRET=<구글 시크릿>

NAVER_CLIENT_ID=<네이버 아이디>
NAVER_CLIENT_SECRET=<네이버 시크릿>
```

### 개발 도구 설정

- **ESLint**: 코드 품질 검사
- **Prettier**: 코드 포맷팅
- **TypeScript**: 타입 안전성

### 로컬 개발 환경

프로젝트는 다음 환경에서 개발되었습니다:

- **OS**: Windows 10/11
- **Node.js**: 22+ (pnpm 권장)
- **개발 서버**: `http://localhost:3000`
- **API 서버**: `http://localhost:8080/api`
- **포트**: 3000 (Next.js), 8080 (API)

## 📚 주요 컴포넌트

### 인증 시스템

- `SessionGuard`: 인증된 사용자만 접근 가능한 컴포넌트
- `SessionProvider`: 세션 상태 관리
- `QueryProvider`: React Query 설정

### 레이아웃

- `Header`: 상단 네비게이션 바
- `Sidebar`: 동적 사이드바 메뉴
- `ApiProvider`: API 컨텍스트 관리

### 폼 컴포넌트

- `EmailField`: 이메일 입력 필드
- `IconSelector`: 아이콘 선택기
- `DropZone`: 파일 드래그 앤 드롭

## 🔒 보안 기능

- **JWT 토큰** 기반 인증
- **미들웨어**를 통한 라우트 보호
- **CSRF 보호**
- **세션 만료** 자동 처리
- **권한 기반** 접근 제어

## 🎨 UI/UX 특징

- **Material Design 3** 준수
- **다크/라이트 테마** 지원
- **반응형 디자인** (모바일 우선)
- **접근성** 고려
- **한국어** 지원

## 📱 반응형 지원

- **모바일 우선** 접근법
- **Tailwind CSS** 브레이크포인트 활용
- **Material-UI** 반응형 컴포넌트

## 🧪 개발 가이드라인

### 코드 스타일

- **TypeScript** 엄격 모드 사용
- **ESLint** + **Prettier** 규칙 준수
- **컴포넌트** PascalCase 네이밍
- **함수/변수** camelCase 네이밍

### 폼 처리

- **React Hook Form** + **Yup** 사용
- **한국어 에러 메시지** 제공
- **Material-UI** 컴포넌트 활용

### 상태 관리

- **Zustand**: 간단한 전역 상태
- **React Query**: 서버 상태 관리
- **Context**: 테마, 인증 등

---

**최종 업데이트**: 2025년 08월
