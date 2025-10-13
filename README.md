# 🎨 Craftfolio - 개인 포트폴리오

React + TypeScript + Vite로 제작된 개인 포트폴리오 웹사이트입니다.

## 🚀 기술 스택

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Deployment**: GitHub Actions + GitHub Pages
- **Package Manager**: npm

## 📦 설치 및 실행

### 로컬 개발 환경

```bash
# 저장소 클론
git clone https://github.com/[username]/craftfolio-json.git
cd craftfolio-json

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 포트폴리오 데이터 자동 동기화와 함께 개발 서버 실행
npm run dev:sync

# 파일 감시 모드 (포트폴리오 데이터 변경 시 자동 동기화)
npm run dev:watch
```

### 빌드

```bash
# 개발용 빌드 (자동 동기화 포함)
npm run build:dev

# 프로덕션 빌드 (자동 동기화 포함)
npm run build:prod

# 빌드 결과 미리보기
npm run preview
```

## 📝 포트폴리오 데이터 관리

### 데이터 파일 구조
```
src/data/portfolio.json    # 메인 데이터 파일 (수정 대상)
portfolio.json            # 루트 복사본 (자동 동기화)
public/portfolio.json     # 빌드용 복사본 (자동 동기화)
```

### 자동 동기화 시스템
- `src/data/portfolio.json`을 수정하면 자동으로 다른 파일들에 반영됩니다
- 빌드 시 자동으로 최신 데이터가 포함됩니다

### 사용 가능한 명령어
```bash
# 수동 동기화
npm run sync

# 파일 감시 모드 (자동 동기화)
npm run watch

# 동기화 + 개발 서버
npm run dev:sync

# 감시 + 개발 서버
npm run dev:watch
```

## 🔧 배포 설정

### GitHub Pages 자동 배포

#### 🚀 간단한 설정 방법 (권장)

1. **GitHub Pages 활성화**
   - GitHub 저장소 → Settings → Pages
   - Source: "GitHub Actions" 선택

2. **워크플로우 권한 설정**
   - 저장소 → Settings → Actions → General
   - "Workflow permissions"에서 "Read and write permissions" 선택
   - "Allow GitHub Actions to create and approve pull requests" 체크

3. **GitHub Pages 환경 설정**
   - 저장소 → Settings → Pages → Environment
   - "github-pages" 환경이 자동으로 생성됨 (없다면 수동 생성)
   - Environment protection rules는 비워둠

4. **자동 배포 트리거**
   - `main` 브랜치에 push 시 자동 배포
   - 수동 배포: Actions 탭에서 "Deploy Portfolio" 워크플로우 실행

#### 🔧 고급 설정 방법 (필요시)

만약 기본 설정으로 문제가 발생한다면:

1. **Personal Access Token 생성**
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - "Generate new token (classic)" 클릭
   - 권한 설정:
     - `repo` (전체 저장소 권한)
     - `workflow` (워크플로우 실행 권한)
     - `write:packages` (패키지 쓰기 권한)
   - 토큰 생성 후 복사하여 저장

2. **GitHub Secrets 설정**
   - 저장소 → Settings → Secrets and variables → Actions
   - "New repository secret" 클릭
   - Name: `PERSONAL_ACCESS_TOKEN`
   - Value: 위에서 생성한 토큰 값 입력

### 배포 URL

배포된 사이트는 다음 URL에서 확인할 수 있습니다:
`https://[username].github.io/craftfolio-json/`

## 📁 프로젝트 구조

```
craftfolio-json/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 배포 워크플로우
├── public/                   # 정적 파일
├── src/
│   ├── components/            # React 컴포넌트
│   │   ├── sections/         # 섹션별 컴포넌트
│   │   └── ui/              # UI 컴포넌트 (shadcn/ui)
│   ├── data/
│   │   └── portfolio.json    # 포트폴리오 데이터
│   ├── hooks/               # 커스텀 훅
│   ├── lib/                 # 유틸리티 함수
│   └── pages/               # 페이지 컴포넌트
├── .env.example             # 환경 변수 예시
├── vite.config.ts          # Vite 설정
└── package.json            # 프로젝트 설정
```

## 🛠️ 개발 가이드

### 환경 변수 설정

```bash
# .env.example을 복사하여 .env 파일 생성
cp .env.example .env

# 필요한 환경 변수 설정
VITE_NODE_ENV=development
```

### 코드 품질 관리

```bash
# ESLint 검사
npm run lint

# 배포 전 검사 (자동 실행)
npm run predeploy
```

### 포트폴리오 데이터 수정

`src/data/portfolio.json` 파일을 수정하여 개인 정보를 업데이트하세요.

## 📋 배포 체크리스트

### 기본 설정 (필수)
- [ ] GitHub 저장소 생성 및 코드 push
- [ ] GitHub Pages 활성화 (Settings → Pages → Source: GitHub Actions)
- [ ] 워크플로우 권한 설정 (Settings → Actions → General)
- [ ] GitHub Pages 환경 확인 (Settings → Pages → Environment)
- [ ] `vite.config.ts`의 base 경로 확인 (저장소명과 일치)
- [ ] 포트폴리오 데이터 업데이트 (`src/data/portfolio.json`)
- [ ] 첫 배포 후 URL 확인

### 고급 설정 (문제 발생시)
- [ ] Personal Access Token 생성 및 권한 설정
- [ ] GitHub Secrets에 `PERSONAL_ACCESS_TOKEN` 등록

## 🔄 배포 프로세스

1. **코드 변경 및 커밋**
   ```bash
   git add .
   git commit -m "feat: 포트폴리오 내용 업데이트"
   git push origin main
   ```

2. **자동 배포 실행**
   - GitHub Actions가 자동으로 빌드 및 배포 실행
   - Actions 탭에서 진행 상황 확인 가능

3. **배포 완료 확인**
   - 배포 URL에서 변경사항 확인
   - 약 1-2분 소요

## 🛠️ 문제 해결

### 권한 오류 발생 시

만약 다음과 같은 오류가 발생한다면:
```
remote: Permission to [repository] denied to github-actions[bot].
fatal: unable to access 'https://github.com/[repository].git/': The requested URL returned error: 403
```

**해결 방법:**
1. **워크플로우 권한 재설정**
   - Settings → Actions → General → Workflow permissions
   - "Read and write permissions" 선택
   - "Allow GitHub Actions to create and approve pull requests" 체크

2. **GitHub Pages 환경 확인**
   - Settings → Pages → Environment
   - "github-pages" 환경이 존재하는지 확인
   - Environment protection rules가 없는지 확인

3. **브랜치 보호 규칙 확인**
   - Settings → Branches → Branch protection rules
   - main 브랜치에 과도한 보호 규칙이 없는지 확인

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 생성해 주세요.

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!