import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Skill {
    name: string;
    level: number;
}

interface SkillCategory {
    category: string;
    items: Skill[];
}

interface SkillsTabProps {
    skills: SkillCategory[];
    onUpdate: (skills: SkillCategory[]) => void;
}

export const SkillsTab = ({ skills, onUpdate }: SkillsTabProps) => {
    const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(-1);

    // 카테고리 추가/수정
    const handleCategorySubmit = () => {
        if (!editingCategory) return;

        if (selectedCategoryIndex >= 0) {
            // 수정
            const updatedSkills = [...skills];
            updatedSkills[selectedCategoryIndex] = editingCategory;
            onUpdate(updatedSkills);
        } else {
            // 추가
            onUpdate([...skills, editingCategory]);
        }

        setIsCategoryDialogOpen(false);
        setEditingCategory(null);
        setSelectedCategoryIndex(-1);

        toast({
            title: selectedCategoryIndex >= 0 ? "카테고리 수정 완료" : "카테고리 추가 완료",
            description: "기술 카테고리가 업데이트되었습니다.",
        });
    };

    // 카테고리 삭제
    const handleDeleteCategory = (index: number) => {
        const updatedSkills = skills.filter((_, i) => i !== index);
        onUpdate(updatedSkills);

        toast({
            title: "카테고리 삭제 완료",
            description: "기술 카테고리가 삭제되었습니다.",
        });
    };

    // 스킬 추가/수정
    const handleSkillSubmit = () => {
        if (!editingSkill || selectedCategoryIndex < 0) return;

        const updatedSkills = [...skills];
        const category = updatedSkills[selectedCategoryIndex];

        const skillIndex = category.items.findIndex(skill => skill.name === editingSkill.name);

        if (skillIndex >= 0) {
            // 수정
            category.items[skillIndex] = editingSkill;
        } else {
            // 추가
            category.items.push(editingSkill);
        }

        onUpdate(updatedSkills);
        setIsSkillDialogOpen(false);
        setEditingSkill(null);

        toast({
            title: skillIndex >= 0 ? "스킬 수정 완료" : "스킬 추가 완료",
            description: "기술 스킬이 업데이트되었습니다.",
        });
    };

    // 스킬 삭제
    const handleDeleteSkill = (categoryIndex: number, skillName: string) => {
        const updatedSkills = [...skills];
        updatedSkills[categoryIndex].items = updatedSkills[categoryIndex].items.filter(
            skill => skill.name !== skillName
        );
        onUpdate(updatedSkills);

        toast({
            title: "스킬 삭제 완료",
            description: "기술 스킬이 삭제되었습니다.",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">기술 스택 관리</h3>
                <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => {
                            setEditingCategory({ category: '', items: [] });
                            setSelectedCategoryIndex(-1);
                        }}>
                            <Plus className="h-4 w-4 mr-2" />
                            카테고리 추가
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedCategoryIndex >= 0 ? '카테고리 수정' : '카테고리 추가'}</DialogTitle>
                            <DialogDescription>기술 카테고리 정보를 입력해주세요</DialogDescription>
                        </DialogHeader>
                        {editingCategory && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="category">카테고리명</Label>
                                    <Input
                                        id="category"
                                        value={editingCategory.category}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, category: e.target.value })}
                                        placeholder="예: Frontend, Backend, DevOps"
                                    />
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>취소</Button>
                            <Button onClick={handleCategorySubmit}>
                                {selectedCategoryIndex >= 0 ? '수정' : '추가'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6">
                {skills.map((skillCategory, categoryIndex) => (
                    <Card key={categoryIndex}>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-lg">{skillCategory.category}</CardTitle>
                                    <CardDescription>{skillCategory.items.length}개 기술</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingSkill({ name: '', level: 50 });
                                                    setSelectedCategoryIndex(categoryIndex);
                                                }}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>스킬 추가</DialogTitle>
                                                <DialogDescription>{skillCategory.category} 카테고리에 새 스킬을 추가합니다</DialogDescription>
                                            </DialogHeader>
                                            {editingSkill && (
                                                <div className="space-y-4">
                                                    <div>
                                                        <Label htmlFor="skillName">스킬명</Label>
                                                        <Input
                                                            id="skillName"
                                                            value={editingSkill.name}
                                                            onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                                                            placeholder="예: React, Node.js, Docker"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="skillLevel">숙련도 (1-100)</Label>
                                                        <Input
                                                            id="skillLevel"
                                                            type="number"
                                                            min="1"
                                                            max="100"
                                                            value={editingSkill.level}
                                                            onChange={(e) => setEditingSkill({ ...editingSkill, level: parseInt(e.target.value) || 50 })}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setIsSkillDialogOpen(false)}>취소</Button>
                                                <Button onClick={handleSkillSubmit}>추가</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setEditingCategory(skillCategory);
                                            setSelectedCategoryIndex(categoryIndex);
                                            setIsCategoryDialogOpen(true);
                                        }}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteCategory(categoryIndex)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {skillCategory.items.map((skill, skillIndex) => (
                                    <div key={skillIndex} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-medium">{skill.name}</span>
                                                <span className="text-sm text-muted-foreground">{skill.level}%</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full transition-all"
                                                    style={{ width: `${skill.level}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-1 ml-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingSkill(skill);
                                                    setSelectedCategoryIndex(categoryIndex);
                                                    setIsSkillDialogOpen(true);
                                                }}
                                            >
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteSkill(categoryIndex, skill.name)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
