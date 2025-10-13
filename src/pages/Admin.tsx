import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Settings, Users, BarChart3, FileText, Plus, Edit, Trash2, Download, Upload, Save, Image as ImageIcon } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { toast } from "@/hooks/use-toast";
import { SkillsTab } from "@/components/admin/SkillsTab";
import { ProjectsTab } from "@/components/admin/ProjectsTab";
import { AwardsTab } from "@/components/admin/AwardsTab";
import { usePortfolio } from "@/contexts/PortfolioContext";


// 타입 정의
interface Experience {
    id: number;
    company: string;
    position: string;
    period: string;
    description: string;
    achievements: string[];
}

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
    experience: Experience[];
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

/**
 * 관리자 페이지 컴포넌트
 * 로고를 5번 클릭하면 접근 가능한 숨겨진 관리자 페이지
 * 포트폴리오 데이터의 모든 섹션을 관리할 수 있는 CRUD 기능 제공
 */
export const Admin = () => {
    const navigate = useNavigate();
    
    // usePortfolio 훅 사용 - React 규칙에 따라 직접 호출
    const { data, updateData, refreshData, isLoading, error } = usePortfolio();
    
    // 🔒 안전 가드 — data.* 접근 전에 필수
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
                    <button 
                        onClick={refreshData}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                        다시 시도
                    </button>
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
                    <button 
                        onClick={refreshData}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                        새로고침
                    </button>
                </div>
            </div>
        );
    }

    const [activeTab, setActiveTab] = useState("personal");
    const [editingItem, setEditingItem] = useState<Experience | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // import type { PortfolioData } from "@/contexts/PortfolioContext";  // 타입 재사용 원하면 활성화
    const [form, setForm] = useState<any>(null);

    // 컨텍스트 data가 로드되면 편집폼에 채우기
    useEffect(() => {
        if (data) setForm(data);
    }, [data]);

    // 파일 업로드를 위한 ref

    // 저장 상태 관리 (실시간 저장으로 인해 단순화)
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // 통계 상태
    const [stats, setStats] = useState({
        totalVisits: 0,
        todayVisits: 0,
        lastVisit: new Date().toISOString(),
    });

    useEffect(() => {
        // 방문 통계 로드
        const savedStats = localStorage.getItem('portfolio-stats');
        if (savedStats) {
            setStats(JSON.parse(savedStats));
        }
    }, []);

    // 관리자 모드 종료
    const handleExit = () => {
        navigate('/');
    };

    // 실시간 저장 알림
    useEffect(() => {
        setLastSaved(new Date());
    }, [data]);

    // JSON 데이터 다운로드
    const handleDownloadData = () => {
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        toast({
            title: "다운로드 완료",
            description: "포트폴리오 데이터가 다운로드되었습니다.",
        });
    };

    // JSON 파일 업로드
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const uploadedData = JSON.parse(e.target?.result as string);
                updateData(uploadedData);
                toast({
                    title: "업로드 완료",
                    description: "포트폴리오 데이터가 업데이트되었습니다.",
                });
            } catch (error) {
                toast({
                    title: "업로드 실패",
                    description: "올바른 JSON 파일을 선택해주세요.",
                    variant: "destructive",
                });
            }
        };
        reader.readAsText(file);
    };

    // 개인정보 수정
    const handlePersonalUpdate = (field: string, value: string) => {
        const updatedData = {
            ...data,
            personal: {
                ...data.personal,
                [field]: value
            }
        };
        updateData(updatedData);
    };


    // 경력 아이템 추가
    const handleAddExperience = (newItem: Omit<Experience, 'id'>) => {
        const maxId = Math.max(...data.experience.map(item => item.id), 0);
        const itemWithId = { ...newItem, id: maxId + 1 };

        const updatedData = {
            ...data,
            experience: [...data.experience, itemWithId]
        };
        updateData(updatedData);

        setIsDialogOpen(false);
        setEditingItem(null);

        toast({
            title: "추가 완료",
            description: "새 경력이 추가되었습니다.",
        });
    };

    // 경력 아이템 수정
    const handleUpdateExperience = (updatedItem: Experience) => {
        const updatedData = {
            ...data,
            experience: data.experience.map(item =>
                item.id === updatedItem.id ? updatedItem : item
            )
        };
        updateData(updatedData);

        setIsDialogOpen(false);
        setEditingItem(null);

        toast({
            title: "수정 완료",
            description: "경력이 수정되었습니다.",
        });
    };

    // 경력 아이템 삭제
    const handleDeleteExperience = (id: number) => {
        const updatedData = {
            ...data,
            experience: data.experience.filter(item => item.id !== id)
        };
        updateData(updatedData);

        toast({
            title: "삭제 완료",
            description: "경력이 삭제되었습니다.",
        });
    };

    // 개인정보 탭 렌더링
    const renderPersonalTab = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>기본 정보</CardTitle>
                    <CardDescription>개인 프로필 정보를 수정할 수 있습니다</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">이름</Label>
                            <Input
                                id="name"
                                value={data.personal.name}
                                onChange={(e) => handlePersonalUpdate('name', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="title">직책</Label>
                            <Input
                                id="title"
                                value={data.personal.title}
                                onChange={(e) => handlePersonalUpdate('title', e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="tagline">태그라인</Label>
                            <Input
                                id="tagline"
                                value={data.personal.tagline}
                                onChange={(e) => handlePersonalUpdate('tagline', e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="bio">자기소개</Label>
                            <Textarea
                                id="bio"
                                value={data.personal.bio}
                                onChange={(e) => handlePersonalUpdate('bio', e.target.value)}
                                rows={4}
                            />
                        </div>
                        <div>
                            <Label htmlFor="location">위치</Label>
                            <Input
                                id="location"
                                value={data.personal.location}
                                onChange={(e) => handlePersonalUpdate('location', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">이메일</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.personal.email}
                                onChange={(e) => handlePersonalUpdate('email', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">전화번호</Label>
                            <Input
                                id="phone"
                                value={data.personal.phone}
                                onChange={(e) => handlePersonalUpdate('phone', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="github">GitHub</Label>
                            <Input
                                id="github"
                                value={data.personal.github}
                                onChange={(e) => handlePersonalUpdate('github', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                                id="linkedin"
                                value={data.personal.linkedin}
                                onChange={(e) => handlePersonalUpdate('linkedin', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="website">웹사이트</Label>
                            <Input
                                id="website"
                                value={data.personal.website}
                                onChange={(e) => handlePersonalUpdate('website', e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <ImageUpload
                                label="프로필 이미지"
                                value={data.personal.profileImage}
                                onChange={(value) => handlePersonalUpdate('profileImage', value)}
                                placeholder="프로필 이미지 URL을 입력하거나 파일을 업로드하세요"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    // 경력 탭 렌더링
    const renderExperienceTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">경력 관리</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingItem({ id: 0, company: '', position: '', period: '', description: '', achievements: [] })}>
                            <Plus className="h-4 w-4 mr-2" />
                            경력 추가
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingItem?.id ? '경력 수정' : '경력 추가'}</DialogTitle>
                            <DialogDescription>경력 정보를 입력해주세요</DialogDescription>
                        </DialogHeader>
                        {editingItem && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="company">회사명</Label>
                                    <Input
                                        id="company"
                                        value={editingItem.company || ''}
                                        onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="position">직책</Label>
                                    <Input
                                        id="position"
                                        value={editingItem.position || ''}
                                        onChange={(e) => setEditingItem({ ...editingItem, position: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="period">기간</Label>
                                    <Input
                                        id="period"
                                        value={editingItem.period || ''}
                                        onChange={(e) => setEditingItem({ ...editingItem, period: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description">설명</Label>
                                    <Textarea
                                        id="description"
                                        value={editingItem.description || ''}
                                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="achievements">주요 성과 (한 줄씩 입력)</Label>
                                    <Textarea
                                        id="achievements"
                                        value={editingItem.achievements?.join('\n') || ''}
                                        onChange={(e) => setEditingItem({ ...editingItem, achievements: e.target.value.split('\n').filter(Boolean) })}
                                        rows={4}
                                    />
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>취소</Button>
                            <Button onClick={() => {
                                if (editingItem?.id) {
                                    handleUpdateExperience(editingItem as Experience);
                                } else {
                                    handleAddExperience(editingItem as Omit<Experience, 'id'>);
                                }
                            }}>
                                {editingItem?.id ? '수정' : '추가'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {data.experience.map((exp) => (
                    <Card key={exp.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{exp.company}</CardTitle>
                                    <CardDescription>{exp.position} • {exp.period}</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setEditingItem(exp);
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteExperience(exp.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">{exp.description}</p>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {exp.achievements.map((achievement, index) => (
                                    <li key={index}>{achievement}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

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
                            <h1 className="text-3xl font-bold text-gradient">관리자 대시보드</h1>
                            <div className="flex items-center gap-2">
                                <p className="text-muted-foreground">포트폴리오 데이터 관리 (실시간 저장)</p>
                                {lastSaved && (
                                    <span className="text-xs text-muted-foreground">
                                        마지막 업데이트: {lastSaved.toLocaleTimeString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={handleDownloadData}>
                            <Download className="h-4 w-4 mr-2" />
                            JSON 다운로드
                        </Button>
                        <div>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload"
                            />
                            <Button variant="outline" asChild>
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <Upload className="h-4 w-4 mr-2" />
                                    JSON 업로드
                                </label>
                            </Button>
                        </div>
                        <Badge variant="secondary" className="px-3 py-1">
                            <Settings className="h-3 w-3 mr-1" />
                            Admin Mode
                        </Badge>
                    </div>
                </div>

                {/* 통계 요약 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">총 방문수</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalVisits}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">프로젝트 수</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.projects.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">경력 수</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.experience.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">수상 이력</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.awards.length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* 탭 네비게이션 */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="personal">소개</TabsTrigger>
                        <TabsTrigger value="experience">경력</TabsTrigger>
                        <TabsTrigger value="skills">기술</TabsTrigger>
                        <TabsTrigger value="projects">프로젝트</TabsTrigger>
                        <TabsTrigger value="awards">수상이력</TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal">
                        {renderPersonalTab()}
                    </TabsContent>

                    <TabsContent value="experience">
                        {renderExperienceTab()}
                    </TabsContent>

                    <TabsContent value="skills">
                        <SkillsTab
                            skills={data.skills}
                            onUpdate={(skills) => updateData({ ...data, skills })}
                        />
                    </TabsContent>

                    <TabsContent value="projects">
                        <ProjectsTab
                            projects={data.projects || []}
                            onUpdate={(projects) => updateData({ ...data, projects })}
                        />
                    </TabsContent>

                    <TabsContent value="awards">
                        <AwardsTab
                            awards={data.awards}
                            onUpdate={(awards) => updateData({ ...data, awards })}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Admin;