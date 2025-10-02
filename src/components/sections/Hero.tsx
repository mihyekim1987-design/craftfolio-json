import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/contexts/PortfolioContext";

export const Hero = () => {
  const { data, isLoading, error } = usePortfolio();

  // 로딩 상태
  if (isLoading) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">포트폴리오를 불러오는 중...</p>
        </div>
      </section>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">오류: {error}</p>
          <Button onClick={() => window.location.reload()}>
            페이지 새로고침
          </Button>
        </div>
      </section>
    );
  }

  // 데이터 없음 상태
  if (!data?.personal) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">데이터를 찾을 수 없습니다.</p>
        </div>
      </section>
    );
  }

  // 정상 데이터가 있을 때
  const { name, title, tagline, profileImage } = data.personal;

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
              src={profileImage}
              alt={name}
              className="relative w-48 h-48 md:w-56 md:h-56 object-cover rounded-3xl shadow-glow"
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