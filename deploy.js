const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// dist/ 폴더 → 루트로 복사
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

const distDir = path.join(__dirname, "dist");
if (!fs.existsSync(distDir)) {
  console.error("❌ 'dist' 폴더가 없습니다. 먼저 npm run build 실행하세요.");
  process.exit(1);
}

copyFiles(distDir, __dirname);
console.log("✅ dist/ 폴더 내용을 root에 복사 완료");

try {
  execSync("git add .", { stdio: "inherit" });
  execSync('git commit -m "Deploy updated site"', { stdio: "inherit" });
  execSync("git push origin main", { stdio: "inherit" });
  console.log("🚀 GitHub에 배포 완료!");
} catch (err) {
  console.error("⚠️ git push 과정에서 문제가 발생했습니다:", err.message);
}

