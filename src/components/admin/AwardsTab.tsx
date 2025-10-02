import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Award, FileCheck, GraduationCap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Award {
    id: number;
    title: string;
    period: string;
    institution: string;
    category: 'award' | 'certification' | 'training';
    details: string;
}

interface AwardsTabProps {
    awards: Award[];
    onUpdate: (awards: Award[]) => void;
}

const categoryIcons = {
    award: Award,
    certification: FileCheck,
    training: GraduationCap,
};

const categoryLabels = {
    award: '수상',
    certification: '자격증',
    training: '교육/연수',
};

const categoryColors = {
    award: 'bg-yellow-100 text-yellow-800',
    certification: 'bg-blue-100 text-blue-800',
    training: 'bg-green-100 text-green-800',
};

export const AwardsTab = ({ awards, onUpdate }: AwardsTabProps) => {
    const [editingAward, setEditingAward] = useState<Partial<Award> | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // 수상이력 추가/수정
    const handleSubmit = () => {
        if (!editingAward) return;

        if (editingAward.id) {
            // 수정
            const updatedAwards = awards.map(award =>
                award.id === editingAward.id ? editingAward as Award : award
            );
            onUpdate(updatedAwards);
        } else {
            // 추가
            const maxId = Math.max(...awards.map(a => a.id), 0);
            const newAward = { ...editingAward, id: maxId + 1 } as Award;
            onUpdate([...awards, newAward]);
        }

        setIsDialogOpen(false);
        setEditingAward(null);

        toast({
            title: editingAward.id ? "수상이력 수정 완료" : "수상이력 추가 완료",
            description: "수상이력이 업데이트되었습니다.",
        });
    };

    // 수상이력 삭제
    const handleDelete = (id: number) => {
        const updatedAwards = awards.filter(award => award.id !== id);
        onUpdate(updatedAwards);

        toast({
            title: "수상이력 삭제 완료",
            description: "수상이력이 삭제되었습니다.",
        });
    };

    // 카테고리별 그룹화
    const groupedAwards = awards.reduce((acc, award) => {
        if (!acc[award.category]) {
            acc[award.category] = [];
        }
        acc[award.category].push(award);
        return acc;
    }, {} as Record<string, Award[]>);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">수상이력 관리</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingAward({
                            title: '',
                            period: '',
                            institution: '',
                            category: 'award',
                            details: ''
                        })}>
                            <Plus className="h-4 w-4 mr-2" />
                            수상이력 추가
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingAward?.id ? '수상이력 수정' : '수상이력 추가'}</DialogTitle>
                            <DialogDescription>수상이력 정보를 입력해주세요</DialogDescription>
                        </DialogHeader>
                        {editingAward && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="title">제목</Label>
                                    <Input
                                        id="title"
                                        value={editingAward.title || ''}
                                        onChange={(e) => setEditingAward({ ...editingAward, title: e.target.value })}
                                        placeholder="수상명, 자격증명, 교육과정명"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="period">날짜</Label>
                                        <Input
                                            id="period"
                                            value={editingAward.period || ''}
                                            onChange={(e) => setEditingAward({ ...editingAward, period: e.target.value })}
                                            placeholder="2023.05 또는 2023.05.15"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="category">카테고리</Label>
                                        <Select
                                            value={editingAward.category || 'award'}
                                            onValueChange={(value: 'award' | 'certification' | 'training') =>
                                                setEditingAward({ ...editingAward, category: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="award">수상</SelectItem>
                                                <SelectItem value="certification">자격증</SelectItem>
                                                <SelectItem value="training">교육/연수</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="institution">기관/주최</Label>
                                    <Input
                                        id="institution"
                                        value={editingAward.institution || ''}
                                        onChange={(e) => setEditingAward({ ...editingAward, institution: e.target.value })}
                                        placeholder="주최기관, 발급기관"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="details">상세 내용</Label>
                                    <Textarea
                                        id="details"
                                        value={editingAward.details || ''}
                                        onChange={(e) => setEditingAward({ ...editingAward, details: e.target.value })}
                                        rows={3}
                                        placeholder="수상 내용, 자격증 레벨, 교육 내용 등"
                                    />
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>취소</Button>
                            <Button onClick={handleSubmit}>
                                {editingAward?.id ? '수정' : '추가'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-8">
                {Object.entries(groupedAwards).map(([category, categoryAwards]) => {
                    const Icon = categoryIcons[category as keyof typeof categoryIcons];
                    const label = categoryLabels[category as keyof typeof categoryLabels];

                    return (
                        <div key={category}>
                            <div className="flex items-center gap-2 mb-4">
                                <Icon className="h-5 w-5" />
                                <h4 className="text-lg font-semibold">{label}</h4>
                                <Badge variant="secondary">{categoryAwards.length}개</Badge>
                            </div>

                            <div className="grid gap-4">
                                {categoryAwards
                                    .sort((a, b) => new Date(b.period).getTime() - new Date(a.period).getTime())
                                    .map((award) => (
                                        <Card key={award.id}>
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <CardTitle className="text-lg">{award.title}</CardTitle>
                                                            <Badge
                                                                variant="secondary"
                                                                className={categoryColors[award.category]}
                                                            >
                                                                {categoryLabels[award.category]}
                                                            </Badge>
                                                        </div>
                                                        <CardDescription>
                                                            {award.institution} • {award.period}
                                                        </CardDescription>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setEditingAward(award);
                                                                setIsDialogOpen(true);
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(award.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            {award.details && (
                                                <CardContent>
                                                    <p className="text-sm text-muted-foreground">{award.details}</p>
                                                </CardContent>
                                            )}
                                        </Card>
                                    ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {awards.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>아직 등록된 수상이력이 없습니다.</p>
                    <p className="text-sm">첫 번째 수상이력을 추가해보세요!</p>
                </div>
            )}
        </div>
    );
};
