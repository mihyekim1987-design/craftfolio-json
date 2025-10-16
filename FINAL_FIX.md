# 🎯 최종 해결: fetch API BASE_URL 문제

## 📅 2025-01-16 최종 수정

### ❌ 문제
```
Fetching from URL: /portfolio.json?v=...
→ 404 오류!

예상: /craftfolio-json/portfolio.json
실제: /portfolio.json (base 경로 누락)
```

### 🔍 원인
**Vite의 BASE_URL 자동 처리 범위:**
- ✅ HTML의 `<script>`, `<link>` 태그 → 자동 처리됨
- ✅ `import` 문 → 자동 처리됨
- ❌ **`fetch()` API → 자동 처리 안 됨!**
- ❌ **`<img src>` 동적 경로 → 자동 처리 안 됨!**

### ✅ 해결

#### 1. PortfolioContext.tsx
```typescript
// ❌ 잘못된 코드
const base = '';
const portfolioUrl = `${base}/portfolio.json?v=${buildId}`;
// → /portfolio.json (404!)

// ✅ 올바른 코드
const base = import.meta.env.BASE_URL || '/';
const portfolioUrl = `${base}portfolio.json?v=${buildId}`
  .replace(/\/+/g, '/').replace(':/', '://');
// → /craftfolio-json/portfolio.json (정상!)
```

#### 2. Hero.tsx & Projects.tsx
```typescript
// ❌ 잘못된 코드
const getImageUrl = (url: string) => {
  return url; // Vite가 자동 처리할 것으로 기대
};
// → /profile-image.jpg (404!)

// ✅ 올바른 코드
const getImageUrl = (url: string) => {
  if (url.startsWith('http') || url.startsWith('data:')) {
    return url;
  }
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${url}`.replace(/\/+/g, '/').replace(':/', '://');
};
// → /craftfolio-json/profile-image.jpg (정상!)
```

### 📊 전체 해결 내역

| 문제 | 커밋 | 상태 |
|------|------|------|
| JSON trailing comma | `6768d1a` | ✅ |
| basePath 불일치 | `a81ee43` | ✅ |
| 파일 크기 최적화 (52% 감소) | `a81ee43` | ✅ |
| .nojekyll 누락 | `2bf90ff` | ✅ |
| **fetch API BASE_URL** | `1f9b6f2` | ✅ |

### 🎯 최종 파일 구조

```
dist/
├── .nojekyll                    ✅ Jekyll 비활성화
├── index.html                   ✅ /craftfolio-json/assets/index-*.js 참조
├── portfolio.json               ✅ 1.77 MB (최적화됨)
├── profile-image.jpg            ✅ 1.49 MB (별도 분리)
└── assets/
    ├── index-Bm0HKHb5.js       ✅ 최신 빌드
    ├── vendor-*.js              ✅
    └── ui-*.js                  ✅
```

### 🧪 검증 방법

#### 로컬 테스트 (선택사항)
```bash
# 1. 빌드
npm run build

# 2. Preview 서버 완전 재시작
# Ctrl+C로 기존 서버 종료 후
npm run preview

# 3. 시크릿 모드로 접속
# Ctrl+Shift+N (Chrome)
# http://localhost:4173/craftfolio-json
```

#### GitHub Pages (최종)
```
1. GitHub Actions 완료 대기 (5-10분)
   https://github.com/mihyekim1987-design/craftfolio-json/actions

2. 배포된 사이트 접속
   https://mihyekim1987-design.github.io/craftfolio-json/

3. 강력 새로고침 (Ctrl+F5)

4. 개발자 도구 확인 (F12)
   Console: 오류 없음
   Network: 모든 파일 200 OK
```

### ✅ 예상 결과

#### Console 메시지
```
✅ PortfolioContext: Starting data fetch...
✅ Fetching from URL: /craftfolio-json/portfolio.json?v=...
✅ Base URL: /craftfolio-json
✅ Fetch response: {status: 200, ok: true}
✅ Portfolio data loaded successfully: {personal, experience, skills, projects, awards}
✅ Data saved to localStorage
```

#### 화면
```
✅ 프로필 이미지 정상 표시
✅ 모든 섹션 정상 로드
✅ 3초 이내 완료
✅ 오류 없음
```

### 📚 핵심 교훈

1. **Vite BASE_URL의 한계**
   - HTML 파일 내의 정적 경로만 자동 처리
   - 동적 fetch()나 img src는 수동 처리 필요

2. **올바른 경로 처리**
   ```typescript
   // 항상 import.meta.env.BASE_URL 사용
   const url = `${import.meta.env.BASE_URL}${path}`
     .replace(/\/+/g, '/');  // 중복 슬래시 제거
   ```

3. **디버깅 팁**
   - Console에서 실제 요청 URL 확인
   - Network 탭에서 404 파일 추적
   - 브라우저 캐시 항상 주의

### 🔗 관련 문서
- [Vite - Public Base Path](https://vitejs.dev/config/shared-options.html#base)
- [Vite - Asset Handling](https://vitejs.dev/guide/assets.html)

---

**최종 커밋:** `1f9b6f2` - fix: fetch API에 BASE_URL 명시적 추가 - 경로 문제 완전 해결

