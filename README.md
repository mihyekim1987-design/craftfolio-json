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
```

### 빌드

```bash
# 개발용 빌드
npm run build:dev

# 프로덕션 빌드
npm run build:prod

# 빌드 결과 미리보기
npm run preview
```

## 🔧 배포 설정

### GitHub Pages 자동 배포

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

3. **GitHub Pages 활성화**
   - GitHub 저장소 → Settings → Pages
   - Source: "GitHub Actions" 선택

4. **워크플로우 권한 설정**
   - 저장소 → Settings → Actions → General
   - "Workflow permissions"에서 "Read and write permissions" 선택
   - "Allow GitHub Actions to create and approve pull requests" 체크

5. **자동 배포 트리거**
   - `main` 브랜치에 push 시 자동 배포
   - 수동 배포: Actions 탭에서 "Deploy Portfolio" 워크플로우 실행

### 배포 URL

배포된 사이트는 다음 URL에서 확인할 수 있습니다:
`https://[username].github.io/craftfolio-json/`

## 📁 프로젝트 구조

```
craftfolio-json/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 배포 워크플로우
├── public/                     # 정적 파일
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

- [ ] GitHub 저장소 생성 및 코드 push
- [ ] Personal Access Token 생성 및 권한 설정
- [ ] GitHub Secrets에 `PERSONAL_ACCESS_TOKEN` 등록
- [ ] GitHub Pages 활성화 (Settings → Pages → Source: GitHub Actions)
- [ ] 워크플로우 권한 설정 (Settings → Actions → General)
- [ ] `vite.config.ts`의 base 경로 확인 (저장소명과 일치)
- [ ] 포트폴리오 데이터 업데이트 (`src/data/portfolio.json`)
- [ ] 첫 배포 후 URL 확인

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

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 생성해 주세요.

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!