import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { portfolioData } from '@/data/portfolioData';

// 포트폴리오 데이터 타입 정의
interface PortfolioData {
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
        category: 'award' | 'certification' | 'training';
        details: string;
    }>;
}

interface PortfolioContextType {
    data: PortfolioData;
    updateData: (newData: PortfolioData) => void;
    refreshData: () => void;
    isLoading: boolean;
    error: string | null;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

interface PortfolioProviderProps {
    children: ReactNode;
}

/**
 * 포트폴리오 데이터 전역 상태 관리 Provider
 * localStorage에서 데이터를 읽어와서 사용하고,
 * 관리자 모드에서 변경된 데이터를 실시간으로 반영
 */
export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ children }) => {
    const [data, setData] = useState<PortfolioData>(portfolioData as PortfolioData);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // localStorage에서 데이터 로드
    const loadDataFromStorage = () => {
        try {
            setIsLoading(true);
            setError(null);

            const savedData = localStorage.getItem('portfolio-data');

            if (savedData) {
                const parsedData = JSON.parse(savedData);
                setData(parsedData);
                setIsLoading(false);
                return parsedData;
            }

            // localStorage에 데이터가 없으면 기본 데이터 사용
            setData(portfolioData as PortfolioData);
            setIsLoading(false);
            return portfolioData as PortfolioData;
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
            setError('데이터 로딩 중 오류가 발생했습니다.');
            setData(portfolioData as PortfolioData); // 폴백 데이터
            setIsLoading(false);
        }
    };

    // 컴포넌트 마운트 시 localStorage에서 데이터 로드
    useEffect(() => {
        loadDataFromStorage();
    }, []);

    // localStorage 변경 감지 (다른 탭에서 변경된 경우)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'portfolio-data' && e.newValue) {
                try {
                    const newData = JSON.parse(e.newValue);
                    setData(newData);
                } catch (error) {
                    console.error('Error parsing storage data:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // 데이터 업데이트 함수
    const updateData = (newData: PortfolioData) => {
        setData(newData);
        localStorage.setItem('portfolio-data', JSON.stringify(newData));
    };

    // 데이터 새로고침 함수
    const refreshData = () => {
        loadDataFromStorage();
    };

    const value: PortfolioContextType = {
        data,
        updateData,
        refreshData,
        isLoading,
        error,
    };

    return (
        <PortfolioContext.Provider value={value}>
            {children}
        </PortfolioContext.Provider>
    );
};

/**
 * 포트폴리오 데이터를 사용하기 위한 커스텀 훅
 */
export const usePortfolio = (): PortfolioContextType => {
    const context = useContext(PortfolioContext);
    if (context === undefined) {
        throw new Error('usePortfolio must be used within a PortfolioProvider');
    }
    return context;
};

export type { PortfolioData };
