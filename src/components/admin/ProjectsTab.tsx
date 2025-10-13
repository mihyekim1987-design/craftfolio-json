import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";

interface Project {
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
}

interface ProjectsTabProps {
    projects: Project[];
    onUpdate: (projects: Project[]) => void;
}

export const ProjectsTab = ({ projects, onUpdate }: ProjectsTabProps) => {
    const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // 안전한 데이터 검증
    if (!projects || !Array.isArray(projects)) {
        return (
            <div className="space-y-6">
                <div className="text-center py-8">
                    <p className="text-muted-foreground">프로젝트 데이터를 불러올 수 없습니다.</p>
                </div>
            </div>
        );
    }

    // 프로젝트 추가/수정
    const handleSubmit = () => {
        if (!editingProject) return;

        if (editingProject.id) {
            // 수정
            const updatedProjects = projects.map(project =>
                project.id === editingProject.id ? editingProject as Project : project
            );
            onUpdate(updatedProjects);
        } else {
            // 추가
            const maxId = Math.max(...projects.map(p => p.id), 0);
            const newProject = { ...editingProject, id: maxId + 1 } as Project;
            onUpdate([...projects, newProject]);
        }

        setIsDialogOpen(false);
        setEditingProject(null);

        toast({
            title: editingProject.id ? "프로젝트 수정 완료" : "프로젝트 추가 완료",
            description: "프로젝트가 업데이트되었습니다.",
        });
    };

    // 프로젝트 삭제
    const handleDelete = (id: number) => {
        const updatedProjects = projects.filter(project => project.id !== id);
        onUpdate(updatedProjects);

        toast({
            title: "프로젝트 삭제 완료",
            description: "프로젝트가 삭제되었습니다.",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">프로젝트 관리</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingProject({
                            title: '',
                            description: '',
                            image: '',
                            tags: [],
                            tech: [],
                            contribution: '',
                            impact: '',
                            links: {}
                        })}>
                            <Plus className="h-4 w-4 mr-2" />
                            프로젝트 추가
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingProject?.id ? '프로젝트 수정' : '프로젝트 추가'}</DialogTitle>
                            <DialogDescription>프로젝트 정보를 입력해주세요</DialogDescription>
                        </DialogHeader>
                        {editingProject && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="title">프로젝트명</Label>
                                        <Input
                                            id="title"
                                            value={editingProject.title || ''}
                                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <ImageUpload
                                            label="프로젝트 이미지"
                                            value={editingProject.image || ''}
                                            onChange={(value) => setEditingProject({ ...editingProject, image: value })}
                                            placeholder="프로젝트 이미지 URL을 입력하거나 파일을 업로드하세요"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description">프로젝트 설명</Label>
                                    <Textarea
                                        id="description"
                                        value={editingProject.description || ''}
                                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
                                        <Input
                                            id="tags"
                                            value={editingProject.tags?.join(', ') || ''}
                                            onChange={(e) => setEditingProject({
                                                ...editingProject,
                                                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                                            })}
                                            placeholder="React, TypeScript, Node.js"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="tech">기술 스택 (쉼표로 구분)</Label>
                                        <Input
                                            id="tech"
                                            value={editingProject.tech?.join(', ') || ''}
                                            onChange={(e) => setEditingProject({
                                                ...editingProject,
                                                tech: e.target.value.split(',').map(tech => tech.trim()).filter(Boolean)
                                            })}
                                            placeholder="React 18, Express, PostgreSQL"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="contribution">기여도/역할</Label>
                                    <Textarea
                                        id="contribution"
                                        value={editingProject.contribution || ''}
                                        onChange={(e) => setEditingProject({ ...editingProject, contribution: e.target.value })}
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="impact">성과/임팩트</Label>
                                    <Textarea
                                        id="impact"
                                        value={editingProject.impact || ''}
                                        onChange={(e) => setEditingProject({ ...editingProject, impact: e.target.value })}
                                        rows={2}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="demo">데모 URL</Label>
                                        <Input
                                            id="demo"
                                            value={editingProject.links?.demo || ''}
                                            onChange={(e) => setEditingProject({
                                                ...editingProject,
                                                links: { ...editingProject.links, demo: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="github">GitHub URL</Label>
                                        <Input
                                            id="github"
                                            value={editingProject.links?.github || ''}
                                            onChange={(e) => setEditingProject({
                                                ...editingProject,
                                                links: { ...editingProject.links, github: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>취소</Button>
                            <Button onClick={handleSubmit}>
                                {editingProject?.id ? '수정' : '추가'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6">
                {projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                        <div className="md:flex">
                            <div className="md:w-1/3">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-48 md:h-full object-cover"
                                />
                            </div>
                            <div className="md:w-2/3">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl">{project.title}</CardTitle>
                                            <CardDescription className="mt-2">{project.description}</CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingProject(project);
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(project.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold mb-2">태그</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tags?.map((tag, index) => (
                                                    <Badge key={index} variant="secondary">{tag}</Badge>
                                                )) || <span className="text-muted-foreground text-sm">태그 없음</span>}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold mb-2">기술 스택</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tech?.map((tech, index) => (
                                                    <Badge key={index} variant="outline">{tech}</Badge>
                                                )) || <span className="text-muted-foreground text-sm">기술 스택 없음</span>}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold mb-1">기여도/역할</h4>
                                            <p className="text-sm text-muted-foreground">{project.contribution}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold mb-1">성과/임팩트</h4>
                                            <p className="text-sm text-muted-foreground">{project.impact}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            {project.links?.demo && (
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="h-3 w-3 mr-1" />
                                                        데모
                                                    </a>
                                                </Button>
                                            )}
                                            {project.links?.github && (
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="h-3 w-3 mr-1" />
                                                        GitHub
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
