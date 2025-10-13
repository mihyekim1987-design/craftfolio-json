#!/usr/bin/env node

/**
 * 포트폴리오 데이터 파일 감시 스크립트
 * src/data/portfolio.json 파일 변경을 감지하여 자동 동기화
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { syncPortfolioData } from './sync-portfolio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFile = path.join(__dirname, 'src', 'data', 'portfolio.json');

function startWatching() {
    console.log('👀 포트폴리오 데이터 파일 감시 시작...');
    console.log(`📁 감시 대상: ${sourceFile}`);

    // 파일이 존재하지 않으면 생성
    if (!fs.existsSync(sourceFile)) {
        console.log('⚠️  소스 파일이 존재하지 않습니다. 생성합니다...');
        const dir = path.dirname(sourceFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(sourceFile, '{}');
    }

    // 파일 감시 시작
    fs.watchFile(sourceFile, { interval: 1000 }, (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
            console.log('\n🔄 포트폴리오 데이터 변경 감지됨');
            console.log(`⏰ ${new Date().toLocaleTimeString()}`);

            try {
                syncPortfolioData();
                console.log('✅ 자동 동기화 완료\n');
            } catch (error) {
                console.error('❌ 동기화 실패:', error.message);
            }
        }
    });

    // 프로세스 종료 시 정리
    process.on('SIGINT', () => {
        console.log('\n👋 파일 감시를 종료합니다...');
        fs.unwatchFile(sourceFile);
        process.exit(0);
    });

    console.log('💡 Ctrl+C를 눌러 감시를 종료할 수 있습니다.');
}

// 스크립트 실행
if (import.meta.url === `file://${process.argv[1]}`) {
    startWatching();
}

export { startWatching };
