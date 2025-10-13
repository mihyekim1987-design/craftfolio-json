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

            // ✅ portfolio.json fetch (캐시 무효화 쿼리 포함)
            const res = await fetch(`/data/portfolio.json?v=${buildId}`, {
                cache: "no-store",
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const json = await res.json();
            setData(json);

            // 로컬 백업 (옵션)
            localStorage.setItem("portfolio-data", JSON.stringify(json));
        } catch (err) {
            console.error("Error loading portfolio.json:", err);
            setError("데이터 로딩 중 오류가 발생했습니다.");

            // fallback: localStorage 백업 불러오기
            const savedData = localStorage.getItem("portfolio-data");
            if (savedData) {
                setData(JSON.parse(savedData));
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

    if (isLoading) return <div>Loading portfolio...</div>;
    if (error) return <div>{error}</div>;
    if (!data) return <div>No portfolio data found.</div>;

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
