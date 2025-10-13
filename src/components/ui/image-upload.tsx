import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImageUploadProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

/**
 * 재사용 가능한 이미지 업로드 컴포넌트
 * - 파일 업로드 및 URL 입력 지원
 * - 이미지 미리보기 기능
 * - Base64 인코딩 자동 처리
 */
export const ImageUpload: React.FC<ImageUploadProps> = ({
    label,
    value,
    onChange,
    placeholder = "이미지 URL을 입력하거나 파일을 업로드하세요",
    className = ""
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    /**
     * 파일 업로드 처리
     */
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // 파일 타입 검증
        if (!file.type.startsWith('image/')) {
            toast({
                title: "오류",
                description: "이미지 파일만 업로드할 수 있습니다.",
                variant: "destructive"
            });
            return;
        }

        // 파일 크기 검증 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "오류",
                description: "파일 크기는 5MB를 초과할 수 없습니다.",
                variant: "destructive"
            });
            return;
        }

        setIsUploading(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64String = e.target?.result as string;
            onChange(base64String);
            setIsUploading(false);
            toast({
                title: "업로드 완료",
                description: "이미지가 성공적으로 업로드되었습니다."
            });
        };
        reader.onerror = () => {
            setIsUploading(false);
            toast({
                title: "오류",
                description: "파일 읽기에 실패했습니다.",
                variant: "destructive"
            });
        };
        reader.readAsDataURL(file);
    };

    /**
     * 이미지 제거
     */
    const handleRemoveImage = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    /**
     * 파일 선택 다이얼로그 열기
     */
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <Label>{label}</Label>

            {/* 현재 이미지 미리보기 */}
            {value && (
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <img
                            src={value}
                            alt="미리보기"
                            className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={handleRemoveImage}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className="text-sm text-gray-600">
                        {value.startsWith('data:') ? '업로드된 이미지' : '외부 이미지'}
                    </div>
                </div>
            )}

            {/* 업로드 버튼 */}
            <div className="flex space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleUploadClick}
                    disabled={isUploading}
                    className="flex items-center space-x-2"
                >
                    <Upload className="h-4 w-4" />
                    <span>{isUploading ? '업로드 중...' : '파일 업로드'}</span>
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2"
                >
                    <ImageIcon className="h-4 w-4" />
                    <span>이미지 선택</span>
                </Button>
            </div>

            {/* 숨겨진 파일 입력 */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
            />

            {/* URL 입력 필드 */}
            <div>
                <Input
                    placeholder={placeholder}
                    value={value.startsWith('data:') ? '' : value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
};
