# 🚀 Vercel 배포 가이드

## 📋 현재 상태
✅ **프로젝트 준비 완료**: 모든 파일이 커밋되고 배포 설정이 완료되었습니다.  
✅ **Vercel 최적화**: `vercel.json` 설정 파일 추가 완료  
✅ **Git 저장소**: 로컬에서 모든 변경사항 커밋 완료

## 🔑 1단계: GitHub에 푸시

### 방법 1: Personal Access Token 사용
```bash
# 1. GitHub에서 Personal Access Token 생성
# Settings > Developer settings > Personal access tokens > Tokens (classic)
# 권한: repo (Full control of private repositories)

# 2. 토큰으로 푸시
git push https://<YOUR_TOKEN>@github.com/hopetreehub/studio-firebase-vercel-supabase.git main
```

### 방법 2: SSH 키 사용 (권장)
```bash
# 1. SSH 키가 설정되어 있다면
git remote set-url origin git@github.com:hopetreehub/studio-firebase-vercel-supabase.git
git push origin main
```

### 방법 3: GitHub Desktop 사용
1. GitHub Desktop 앱 열기
2. 프로젝트 폴더 추가
3. Publish to GitHub 클릭

### 방법 4: VS Code 사용
1. VS Code에서 프로젝트 열기
2. Source Control 탭 (Ctrl+Shift+G)
3. "Sync Changes" 또는 "Push" 클릭

## 🌐 2단계: Vercel 배포

### A. Vercel 웹사이트에서 배포
1. [vercel.com](https://vercel.com) 방문
2. GitHub 계정으로 로그인
3. "New Project" 클릭
4. `hopetreehub/studio-firebase-vercel-supabase` 저장소 선택
5. Framework Preset: **Next.js** (자동 감지됨)
6. Root Directory: `./` (기본값)

### B. 환경 변수 설정
배포 전에 다음 환경 변수들을 Vercel에서 설정하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google OAuth (선택사항)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_client_secret

# Site URL (배포 후 자동 설정됨)
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

### C. 배포 실행
1. "Deploy" 버튼 클릭
2. 빌드 과정 모니터링
3. 배포 완료 후 URL 확인

## 🛠️ 3단계: 배포 후 설정

### A. 도메인 설정 (선택사항)
1. Vercel 대시보드 > Domains
2. 커스텀 도메인 추가
3. DNS 설정 업데이트

### B. 환경별 설정
- **Production**: 실제 Firebase/Supabase 프로젝트 연결
- **Preview**: 개발용 프로젝트 연결 (선택사항)

## 🔧 4단계: 문제 해결

### 빌드 오류 시
1. Vercel 대시보드 > Functions 탭에서 로그 확인
2. 환경 변수 누락 확인
3. TypeScript 오류는 `next.config.ts`에서 무시 설정됨

### 환경 변수 오류 시
```javascript
// src/lib/supabase/client.ts에서 확인
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key environment variables.');
}
```

## 📊 5단계: 성능 최적화

### Vercel Analytics 활성화
1. Vercel 대시보드 > Analytics
2. 활성화 후 사용자 데이터 모니터링

### 이미지 최적화
- Next.js Image 컴포넌트 사용됨
- Cloudinary 이미지 최적화 설정됨

## 🎯 완료!

배포가 완료되면 다음 URL에서 앱에 접근할 수 있습니다:
- **Production**: `https://studio-firebase-vercel-supabase.vercel.app`
- **Preview**: 각 브랜치별 미리보기 URL

---

## 📞 지원

문제가 발생하면:
1. Vercel 대시보드의 Function 로그 확인
2. GitHub Actions (설정된 경우) 확인
3. 환경 변수 설정 재확인

**🎉 성공적인 배포를 위해 화이팅!**