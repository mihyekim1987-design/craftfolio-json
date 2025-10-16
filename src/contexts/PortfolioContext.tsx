import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";

// 포트폴리오 데이터 타입 정의
export interface PortfolioData {
    personal: {
        name: string;
        title: string;
        tagline: string;
        bio: string;
        location: string;
        email: string;
        phone: string;
        github: string;
        linkedin: string;
        website: string;
        profileImage: string;
        stats: {
            experience: string;
            projects: string;
            clients: string;
        };
    };
    experience: Array<{
        id: number;
        company: string;
        position: string;
        period: string;
        description: string;
        achievements: string[];
    }>;
    skills: Array<{
        category: string;
        items: Array<{
            name: string;
            level: number;
        }>;
    }>;
    projects: Array<{
        id: number;
        title: string;
        description: string;
        image: string;
        tags: string[];
        tech: string[];
        contribution: string;
        impact: string;
        links?: {
            demo?: string;
            github?: string;
            PPT?: string;
            Colab?: string;
        };
        link?: {
            github?: string;
        };
    }>;
    awards: Array<{
        id: number;
        title: string;
        period: string;
        institution: string;
        category: "award" | "certification" | "training";
        details: string;
    }>;
}

interface PortfolioContextType {
    data: PortfolioData | null;
    updateData: (newData: PortfolioData) => void;
    refreshData: () => void;
    isLoading: boolean;
    error: string | null;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(
    undefined
);

interface PortfolioProviderProps {
    children: ReactNode;
}

/**
 * ✅ fetch 기반 포트폴리오 Provider
 * - portfolio.json을 fetch하여 최신 데이터로 로드
 * - NEXT_PUBLIC_BUILD_ID를 쿼리로 붙여 캐시 무효화
 * - localStorage에 백업 저장
 */
export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({
    children,
}) => {
    const [data, setData] = useState<PortfolioData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPortfolioData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const buildId =
                process.env.NEXT_PUBLIC_BUILD_ID || Date.now().toString();
            
            console.log('PortfolioContext: Starting data fetch...');

            // 👇 fetch API는 Vite base를 자동으로 처리하지 않으므로 명시적으로 추가
            const base = import.meta.env.BASE_URL || '/';
            
            // 안전한 URL 생성
            const portfolioUrl = `${base}portfolio.json?v=${buildId}`.replace(/\/+/g, '/').replace(':/', '://');
            console.log('Fetching from URL:', portfolioUrl);
            console.log('Base URL:', base);

            // 모바일 환경 디버깅
            console.log("Fetching portfolio data...", {
                base,
                buildId,
                userAgent: navigator.userAgent,
                url: portfolioUrl,
                isProduction: import.meta.env.PROD
            });

            // ✅ portfolio.json fetch (캐시 무효화 쿼리 포함, 타임아웃 추가)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15초 타임아웃

            const res = await fetch(portfolioUrl, {
                cache: "no-store",
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            clearTimeout(timeoutId);

            console.log("Fetch response:", {
                status: res.status,
                statusText: res.statusText,
                ok: res.ok,
                url: res.url,
                contentLength: res.headers.get('content-length')
            });

            if (!res.ok) {
                throw new Error(`데이터를 불러올 수 없습니다 (HTTP ${res.status})`);
            }

            const json = await res.json();
            console.log("Portfolio data loaded successfully:", Object.keys(json));
            
            // 데이터 유효성 검사
            if (!json || typeof json !== 'object') {
                throw new Error('Invalid portfolio data format');
            }
            
            setData(json);

            // 로컬 백업 (옵션)
            try {
                localStorage.setItem("portfolio-data", JSON.stringify(json));
                console.log('Data saved to localStorage');
            } catch (storageError) {
                console.warn('Failed to save to localStorage:', storageError);
            }
        } catch (err) {
            console.error("Error loading portfolio.json:", err);

            let errorMessage = '알 수 없는 오류';
            if (err instanceof Error) {
                if (err.name === 'AbortError') {
                    errorMessage = '데이터 로딩 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.';
                } else {
                    errorMessage = err.message;
                }
            }

            // 모바일 환경에서의 상세한 오류 로깅
            console.error("Debugging info:", {
                error: err,
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
                isMobile: typeof navigator !== 'undefined' ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) : false,
                isOnline: typeof navigator !== 'undefined' ? navigator.onLine : 'unknown',
                localStorage: typeof localStorage !== 'undefined',
                window: typeof window !== 'undefined'
            });

            // fallback: localStorage 백업 불러오기
            try {
                const savedData = localStorage.getItem("portfolio-data");
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    setData(parsedData);
                    setError(null); // 백업 데이터가 있으면 오류 해제
                    console.log("✅ Using cached portfolio data from localStorage");
                } else {
                    setError(`데이터 로딩 중 오류가 발생했습니다: ${errorMessage}`);
                }
            } catch (parseErr) {
                console.error("Error parsing cached data:", parseErr);
                setError(`데이터 로딩 실패: ${errorMessage}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolioData();

        // 모바일에서 네트워크 연결 문제 시 재시도
        const retryTimeout = setTimeout(() => {
            if (!data && !error) {
                console.log("Retrying portfolio data fetch...");
                fetchPortfolioData();
            }
        }, 5000); // 5초 후 재시도

        return () => clearTimeout(retryTimeout);
    }, []);

    const updateData = (newData: PortfolioData) => {
        setData(newData);
        localStorage.setItem("portfolio-data", JSON.stringify(newData));

        // 브라우저 환경에서는 localStorage만 사용
        console.log('✅ 포트폴리오 데이터 업데이트 완료 (localStorage)');
        
        // 서버 환경에서만 파일 동기화 (개발 환경에서만)
        if (typeof window === 'undefined' && typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
            try {
                // Node.js 환경에서만 파일 시스템 접근
                const fs = require('fs');
                const path = require('path');
                const dataFilePath = path.join(process.cwd(), 'src', 'data', 'portfolio.json');

                fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2), 'utf8');
                console.log('✅ src/data/portfolio.json 자동 업데이트 완료');

                // 다른 파일들도 동기화
                const rootFilePath = path.join(process.cwd(), 'portfolio.json');
                const publicFilePath = path.join(process.cwd(), 'public', 'portfolio.json');

                fs.writeFileSync(rootFilePath, JSON.stringify(newData, null, 2), 'utf8');
                fs.writeFileSync(publicFilePath, JSON.stringify(newData, null, 2), 'utf8');

                console.log('✅ 모든 포트폴리오 파일 자동 동기화 완료');
            } catch (syncError) {
                console.error('❌ 자동 동기화 실패:', syncError);
                // 동기화 실패해도 데이터 업데이트는 계속 진행
            }
        }
    };

    const refreshData = () => {
        fetchPortfolioData();
    };

    const value: PortfolioContextType = {
        data,
        updateData,
        refreshData,
        isLoading,
        error,
    };

    // PortfolioProvider는 데이터만 제공하고, UI 처리는 각 컴포넌트에서 담당

    return (
        <PortfolioContext.Provider value={value}>
            {children}
        </PortfolioContext.Provider>
    );
};

/**
 * ✅ usePortfolio 훅
 * 포트폴리오 데이터 전역 상태를 사용하는 커스텀 훅
 */
export const usePortfolio = (): PortfolioContextType => {
    const context = useContext(PortfolioContext);
    if (context === undefined) {
        throw new Error("usePortfolio must be used within a PortfolioProvider");
    }
    return context;
};
