import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings, Users, BarChart3, FileText } from "lucide-react";

/**
 * 관리자 페이지 컴포넌트
 * 로고를 5번 클릭하면 접근 가능한 숨겨진 관리자 페이지
 */
export const Admin = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalVisits: 0,
        todayVisits: 0,
        lastVisit: new Date().toISOString(),
    });

    useEffect(() => {
        // 방문 통계 로드 (localStorage에서)
        const savedStats = localStorage.getItem('portfolio-stats');
        if (savedStats) {
            setStats(JSON.parse(savedStats));
        }

        // 현재 방문 기록
        const today = new Date().toDateString();
        const lastVisitDate = new Date(stats.lastVisit).toDateString();

        const newStats = {
            totalVisits: stats.totalVisits + 1,
            todayVisits: today === lastVisitDate ? stats.todayVisits + 1 : 1,
            lastVisit: new Date().toISOString(),
        };

        setStats(newStats);
        localStorage.setItem('portfolio-stats', JSON.stringify(newStats));
    }, []);

    // 관리자 모드 종료
    const handleExit = () => {
        navigate('/');
    };

    // 통계 초기화
    const handleResetStats = () => {
        const resetStats = {
            totalVisits: 0,
            todayVisits: 0,
            lastVisit: new Date().toISOString(),
        };
        setStats(resetStats);
        localStorage.setItem('portfolio-stats', JSON.stringify(resetStats));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
            <div className="container mx-auto max-w-6xl">
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
                            <h1 className="text-3xl font-bold text-gradient">관리자 대시보드</h1>
                            <p className="text-muted-foreground">포트폴리오 관리 및 통계</p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="px-3 py-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Admin Mode
                    </Badge>
                </div>

                {/* 통계 카드들 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">총 방문수</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalVisits}</div>
                            <p className="text-xs text-muted-foreground">
                                누적 방문자 수
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">오늘 방문수</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.todayVisits}</div>
                            <p className="text-xs text-muted-foreground">
                                오늘 방문자 수
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">마지막 방문</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-bold">
                                {new Date(stats.lastVisit).toLocaleString('ko-KR')}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                최근 접속 시간
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">시스템 상태</CardTitle>
                            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-bold text-green-600">정상</div>
                            <p className="text-xs text-muted-foreground">
                                모든 시스템 정상 작동
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* 관리 기능들 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>빠른 작업</CardTitle>
                            <CardDescription>
                                자주 사용하는 관리 기능들
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={handleResetStats}
                            >
                                <BarChart3 className="h-4 w-4 mr-2" />
                                통계 초기화
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => window.open('https://github.com', '_blank')}
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                GitHub 저장소 열기
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => {
                                    const data = {
                                        stats,
                                        timestamp: new Date().toISOString(),
                                    };
                                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'portfolio-stats.json';
                                    a.click();
                                    URL.revokeObjectURL(url);
                                }}
                            >
                                <Settings className="h-4 w-4 mr-2" />
                                통계 데이터 내보내기
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>시스템 정보</CardTitle>
                            <CardDescription>
                                현재 포트폴리오 시스템 정보
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">버전</span>
                                <Badge variant="outline">v1.0.0</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">빌드</span>
                                <Badge variant="outline">React + Vite</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">배포</span>
                                <Badge variant="outline">GitHub Pages</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">마지막 업데이트</span>
                                <Badge variant="outline">{new Date().toLocaleDateString('ko-KR')}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 푸터 */}
                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>⚠️ 이 페이지는 관리자 전용입니다. 로고를 5번 클릭하여 접근했습니다.</p>
                </div>
            </div>
        </div>
    );
};

export default Admin;
