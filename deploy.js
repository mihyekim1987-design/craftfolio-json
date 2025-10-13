/**
 * 포트폴리오 사이트 배포 스크립트
 * - dist 폴더의 빌드된 파일들을 루트로 복사
 * - Git을 통해 GitHub Pages에 배포
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * 소스 디렉토리의 모든 파일을 대상 디렉토리로 재귀적으로 복사
 * @param {string} srcDir - 복사할 소스 디렉토리 경로
 * @param {string} destDir - 복사될 대상 디렉토리 경로
 */
function copyFiles(srcDir, destDir) {
  fs.readdirSync(srcDir).forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);

    if (fs.lstatSync(srcPath).isDirectory()) {
      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
      copyFiles(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// dist 폴더 존재 여부 확인
const distDir = path.join(__dirname, "dist");
if (!fs.existsSync(distDir)) {
  console.error("❌ 'dist' 폴더가 없습니다. 먼저 npm run build 실행하세요.");
  process.exit(1);
}

// dist 폴더 내용을 루트로 복사
copyFiles(distDir, __dirname);
console.log("✅ dist/ 폴더 내용을 root에 복사 완료");

// Git을 통한 배포 실행
try {
  console.log("📝 Git에 변경사항 추가 중...");
  execSync("git add .", { stdio: "inherit" });

  console.log("💾 Git 커밋 생성 중...");
  execSync('git commit -m "feat: 포트폴리오 사이트 배포"', { stdio: "inherit" });

  console.log("🚀 GitHub에 푸시 중...");
  execSync("git push origin main", { stdio: "inherit" });

  console.log("🚀 GitHub에 배포 완료!");
} catch (err) {
  console.error("⚠️ Git 배포 과정에서 문제가 발생했습니다:");
  console.error("에러 상세:", err.message);
  console.error("해결 방법:");
  console.error("1. Git 상태 확인: git status");
  console.error("2. 원격 저장소 연결 확인: git remote -v");
  console.error("3. 인증 정보 확인 후 재시도");
  process.exit(1);
}

