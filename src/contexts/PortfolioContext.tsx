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
        links: {
            demo?: string;
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

            // 👇 추가: basePath 계산 헬퍼
            const getBasePath = () => {
                // Actions에서 주입했으면 그 값을 우선 사용
                if (process.env.NEXT_PUBLIC_BASE_PATH) return process.env.NEXT_PUBLIC_BASE_PATH;
                // 브라우저 경로에서 /REPO_NAME 추론
                if (typeof window !== "undefined") {
                    const seg = window.location.pathname.split("/")[1];
                    return seg ? `/${seg}` : "";
                }
                return "";
            };
            const base = getBasePath();

            // ✅ portfolio.json fetch (캐시 무효화 쿼리 포함)
            const res = await fetch(`${base}/portfolio.json?v=${buildId}`, {
                cache: "no-store",
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const json = await res.json();
            setData(json);

            // 로컬 백업 (옵션)
            localStorage.setItem("portfolio-data", JSON.stringify(json));
        } catch (err) {
            console.error("Error loading portfolio.json:", err);

            // fallback: localStorage 백업 불러오기
            const savedData = localStorage.getItem("portfolio-data");
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    setData(parsedData);
                    setError(null); // 백업 데이터가 있으면 오류 해제
                    console.log("Using cached portfolio data from localStorage");
                } catch (parseErr) {
                    console.error("Error parsing cached data:", parseErr);
                    setError("데이터 로딩 중 오류가 발생했습니다.");
                }
            } else {
                setError("데이터 로딩 중 오류가 발생했습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolioData();
    }, []);

    const updateData = (newData: PortfolioData) => {
        setData(newData);
        localStorage.setItem("portfolio-data", JSON.stringify(newData));
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

    // 로딩 중이거나 데이터가 없을 때는 로딩 화면 표시
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">포트폴리오 데이터를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    // 오류 발생 시 fallback 데이터 사용
    if (error && !data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={refreshData}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    // 데이터가 없을 때
    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">포트폴리오 데이터를 찾을 수 없습니다.</p>
                    <button
                        onClick={refreshData}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

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
