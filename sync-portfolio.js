#!/usr/bin/env node

/**
 * 포트폴리오 데이터 자동 동기화 스크립트
 * src/data/portfolio.json의 변경사항을 루트와 public 폴더로 자동 복사
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFile = path.join(__dirname, 'src', 'data', 'portfolio.json');
const rootFile = path.join(__dirname, 'portfolio.json');
const publicFile = path.join(__dirname, 'public', 'portfolio.json');

function syncPortfolioData() {
    try {
        // 소스 파일 존재 확인
        if (!fs.existsSync(sourceFile)) {
            console.error('❌ 소스 파일을 찾을 수 없습니다:', sourceFile);
            process.exit(1);
        }

        // 파일 복사
        fs.copyFileSync(sourceFile, rootFile);
        fs.copyFileSync(sourceFile, publicFile);

        console.log('✅ 포트폴리오 데이터 동기화 완료');
        console.log(`📁 ${sourceFile} → ${rootFile}`);
        console.log(`📁 ${sourceFile} → ${publicFile}`);

        // 파일 크기 확인
        const stats = fs.statSync(sourceFile);
        console.log(`📊 파일 크기: ${(stats.size / 1024).toFixed(2)} KB`);

    } catch (error) {
        console.error('❌ 동기화 중 오류 발생:', error.message);
        process.exit(1);
    }
}

// 스크립트 실행
if (import.meta.url === `file://${process.argv[1]}`) {
    syncPortfolioData();
} else {
    // 모듈로 import된 경우에도 실행
    syncPortfolioData();
}

export { syncPortfolioData };
