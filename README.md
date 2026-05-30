# LogoMaker

AI 기반 로고 생성 웹 앱입니다. 브랜드 이름, 스타일, 색상 등을 단계별로 입력하면 OpenAI DALL-E 3가 전문적인 로고를 생성합니다.

## 기술 스택

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **AI**: OpenAI DALL-E 3 API
- **Database**: Supabase (PostgreSQL + Storage)
- **Deploy**: Vercel

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 복사하여 `.env.local` 파일을 만듭니다.

```bash
cp .env.example .env.local
```

| 변수 | 설명 |
|------|------|
| `OPENAI_API_KEY` | [OpenAI API Key](https://platform.openai.com/api-keys) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (서버 전용) |

### 3. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase/migrations/001_create_logos_table.sql` 실행
3. Storage에 `logos` 버킷이 자동 생성됨 (public)

### 4. 로컬 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

## Vercel 배포

### GitHub 연동

```bash
git init
git add .
git commit -m "Initial commit: LogoMaker app"
git remote add origin https://github.com/YOUR_USERNAME/logomaker.git
git push -u origin main
```

### Vercel 설정

1. [Vercel](https://vercel.com)에서 GitHub 저장소 import
2. Environment Variables에 `.env.local` 값 등록
3. Deploy

## 앱 사용 흐름

1. **브랜드 이름** - 로고에 들어갈 상호/이름 입력
2. **로고 유형** - 워드마크, 심볼, 조합형, 엠블럼 선택
3. **디자인 스타일** - 미니멀, 모던, 빈티지 등 8가지 스타일
4. **색상** - 프리셋 팔레트 또는 커스텀 컬러 선택
5. **추가 정보** - 업종, 키워드, 요청사항 (선택)
6. **생성** - AI가 로고 생성 → PNG 다운로드

## 프로젝트 구조

```
src/
├── app/
│   ├── api/generate/    # 로고 생성 API
│   ├── api/logos/       # 로고 목록 API
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── LogoWizard.tsx   # 메인 위저드
│   ├── steps/           # 각 단계 컴포넌트
│   └── ...
├── lib/
│   ├── openai.ts        # DALL-E 연동
│   ├── supabase.ts      # DB 클라이언트
│   ├── storage.ts       # 이미지 업로드
│   └── prompt.ts        # AI 프롬프트 생성
└── types/
    └── logo.ts          # 타입 정의
```

## 라이선스

MIT
