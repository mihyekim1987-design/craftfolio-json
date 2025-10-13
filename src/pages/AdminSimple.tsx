import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Settings } from "lucide-react";

/**
 * 간단한 관리자 페이지 - 오류 진단용
 */
export const AdminSimple = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        // 간단한 데이터 로딩 테스트
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // portfolio.json 로드 시도
                const response = await fetch('/portfolio.json');
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const portfolioData = await response.json();
                setData(portfolioData);
                console.log('✅ 포트폴리오 데이터 로드 성공:', portfolioData);
            } catch (err) {
                console.error('❌ 데이터 로드 실패:', err);
                setError(err instanceof Error ? err.message : '알 수 없는 오류');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // 관리자 모드 종료
    const handleExit = () => {
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">데이터를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="text-destructive text-lg mb-4">❌ 오류 발생</div>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                        새로고침
                    </Button>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="text-muted-foreground text-lg mb-4">📄 데이터 없음</div>
                    <p className="text-muted-foreground mb-4">포트폴리오 데이터를 찾을 수 없습니다.</p>
                    <Button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                        새로고침
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted">
            <div className="container mx-auto max-w-6xl p-4 pb-8">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleExit}
                            className="hover:bg-primary hover:text-primary-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gradient">관리자 대시보드 (간단 버전)</h1>
                            <p className="text-muted-foreground">포트폴리오 데이터 관리</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span className="text-sm text-muted-foreground">Admin Mode</span>
                    </div>
                </div>

                {/* 데이터 요약 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">개인정보</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.personal?.name || 'N/A'}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">프로젝트 수</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.projects?.length || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">경력 수</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.experience?.length || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">수상 이력</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.awards?.length || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* 데이터 미리보기 */}
                <Card>
                    <CardHeader>
                        <CardTitle>데이터 미리보기</CardTitle>
                        <CardDescription>현재 로드된 포트폴리오 데이터</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-96">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminSimple;
