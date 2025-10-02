// 포트폴리오 데이터 (TypeScript로 직접 정의)
export const portfolioData = {
    personal: {
        name: "홍길동",
        title: "Full Stack Developer",
        tagline: "코드로 세상을 더 나은 곳으로 만듭니다",
        bio: "안녕하세요! 저는 3년 차 풀스택 개발자입니다. 사용자 중심의 아름답고 효율적인 웹 애플리케이션을 만드는 것을 좋아합니다. React, TypeScript, Node.js를 주로 사용하며, 항상 새로운 기술을 배우고 도전하는 것을 즐깁니다.",
        location: "서울, 대한민국",
        email: "hong@example.com",
        phone: "+82-10-1234-5678",
        github: "https://github.com/honggildong",
        linkedin: "https://linkedin.com/in/honggildong",
        website: "https://honggildong.dev",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        stats: {
            experience: "3+",
            projects: "20+",
            clients: "15+"
        }
    },
    experience: [
        {
            id: "1",
            company: "테크 스타트업 A",
            position: "Senior Frontend Developer",
            period: "2022.03 - 현재",
            description: "React 기반 웹 애플리케이션 개발 및 팀 리딩",
            technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
            achievements: [
                "사용자 경험 개선으로 전환율 30% 향상",
                "코드 리뷰 프로세스 도입으로 버그 50% 감소",
                "주니어 개발자 3명 멘토링"
            ]
        },
        {
            id: "2",
            company: "중견 IT 회사 B",
            position: "Full Stack Developer",
            period: "2021.01 - 2022.02",
            description: "웹 서비스 풀스택 개발 및 유지보수",
            technologies: ["React", "Node.js", "MongoDB", "AWS"],
            achievements: [
                "신규 서비스 MVP 개발 완료",
                "API 성능 최적화로 응답속도 40% 개선",
                "CI/CD 파이프라인 구축"
            ]
        }
    ],
    skills: [
        {
            category: "Frontend",
            items: [
                { name: "React", level: 90 },
                { name: "TypeScript", level: 85 },
                { name: "Next.js", level: 80 },
                { name: "Vue.js", level: 70 },
                { name: "HTML/CSS", level: 95 }
            ]
        },
        {
            category: "Backend",
            items: [
                { name: "Node.js", level: 85 },
                { name: "Python", level: 75 },
                { name: "Express.js", level: 80 },
                { name: "NestJS", level: 70 }
            ]
        },
        {
            category: "Database",
            items: [
                { name: "MongoDB", level: 80 },
                { name: "PostgreSQL", level: 75 },
                { name: "Redis", level: 65 }
            ]
        },
        {
            category: "DevOps",
            items: [
                { name: "AWS", level: 70 },
                { name: "Docker", level: 75 },
                { name: "GitHub Actions", level: 80 }
            ]
        }
    ],
    projects: [
        {
            id: "1",
            title: "E-커머스 플랫폼",
            description: "React와 Node.js를 활용한 풀스택 쇼핑몰 구축",
            image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
            technologies: ["React", "Node.js", "MongoDB", "Stripe"],
            features: [
                "사용자 인증 및 권한 관리",
                "상품 카탈로그 및 검색 기능",
                "장바구니 및 결제 시스템",
                "관리자 대시보드"
            ],
            github: "https://github.com/honggildong/ecommerce",
            demo: "https://ecommerce-demo.vercel.app",
            period: "2023.01 - 2023.03"
        },
        {
            id: "2",
            title: "실시간 채팅 애플리케이션",
            description: "Socket.io를 활용한 실시간 메시징 서비스",
            image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&h=400&fit=crop",
            technologies: ["React", "Socket.io", "Express", "Redis"],
            features: [
                "실시간 메시지 전송",
                "채팅방 생성 및 관리",
                "파일 첨부 기능",
                "온라인 상태 표시"
            ],
            github: "https://github.com/honggildong/chat-app",
            demo: "https://chat-demo.vercel.app",
            period: "2022.10 - 2022.12"
        },
        {
            id: "3",
            title: "프로젝트 관리 도구",
            description: "팀 협업을 위한 칸반 보드 스타일 프로젝트 관리 툴",
            image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
            technologies: ["Next.js", "Prisma", "PostgreSQL", "Tailwind"],
            features: [
                "드래그 앤 드롭 태스크 관리",
                "팀원 초대 및 권한 관리",
                "프로젝트 진행률 시각화",
                "댓글 및 첨부파일 기능"
            ],
            github: "https://github.com/honggildong/project-manager",
            demo: "https://project-demo.vercel.app",
            period: "2022.06 - 2022.09"
        }
    ],
    awards: [
        {
            id: "1",
            title: "해커톤 대상",
            organization: "테크 컨퍼런스 2023",
            date: "2023.11",
            description: "AI를 활용한 학습 도구 개발로 대상 수상",
            category: "award" as const,
            details: "48시간 해커톤에서 OpenAI API를 활용한 개인 맞춤형 학습 도구를 개발하여 300여 팀 중 1위를 차지했습니다."
        },
        {
            id: "2",
            title: "정보처리기사",
            organization: "한국산업인력공단",
            date: "2021.08",
            description: "정보처리기사 자격증 취득",
            category: "certification" as const,
            details: "소프트웨어 개발 및 정보시스템 구축에 대한 전문 지식을 인정받아 정보처리기사 자격증을 취득했습니다."
        },
        {
            id: "3",
            title: "React 마스터 과정 수료",
            organization: "온라인 교육 플랫폼",
            date: "2021.03",
            description: "React 심화 과정 우수 수료",
            category: "training" as const,
            details: "6개월간의 React 심화 과정을 수료하며 고급 패턴과 성능 최적화 기법을 학습했습니다."
        }
    ]
};
