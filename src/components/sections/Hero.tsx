import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/contexts/PortfolioContext";

export const Hero = () => {
  const { data } = usePortfolio();

  // 데이터가 없을 때만 처리
  if (!data?.personal) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">포트폴리오 데이터를 불러오는 중...</p>
          <p className="text-sm text-muted-foreground mt-2">잠시만 기다려주세요</p>
        </div>
      </section>
    );
  }

  // 정상 데이터가 있을 때
  const { name, title, tagline, profileImage } = data.personal;

  // 이미지 URL 처리: Vite가 자동으로 base를 처리
  const getImageUrl = (url: string) => {
    // 이미 절대 URL이거나 data: URL인 경우 그대로 반환
    if (url.startsWith('http') || url.startsWith('data:')) {
      return url;
    }
    
    // 상대 경로는 그대로 반환 (Vite가 자동으로 base를 추가함)
    return url;
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
          {/* Profile Image */}
          <div className="relative">
            <div className="absolute inset-0 gradient-primary rounded-3xl blur-xl opacity-50 animate-pulse" />
            <img
              src={getImageUrl(profileImage)}
              alt={name}
              className="relative w-48 h-48 md:w-56 md:h-56 object-cover rounded-3xl shadow-glow"
              onError={(e) => {
                console.error('Failed to load profile image:', profileImage);
                // 로딩 실패 시 placeholder 이미지 사용
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>

          {/* Text Content */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="text-gradient">{name}</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground/80">
              {title}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {tagline}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="gradient-primary shadow-glow hover:scale-105 transition-smooth"
              asChild
            >
              <a href="#projects">프로젝트 보기</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="hover:scale-105 transition-smooth"
              asChild
            >
              <a href="#contact">연락하기</a>
            </Button>
          </div>

          {/* Scroll Indicator */}
          <a
            href="#about"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
          >
            <ArrowDown className="h-6 w-6 text-primary" />
          </a>
        </div>
      </div>
    </section>
  );
};