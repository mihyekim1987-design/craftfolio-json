import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Awards } from "@/components/sections/Awards";
import { Contact } from "@/components/sections/Contact";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { isLoading, error, refreshData } = usePortfolio();

  // 에러 발생 시 에러 화면 표시
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-6">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">페이지 로딩 중 오류가 발생했습니다</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <div className="space-y-3">
            <Button 
              onClick={refreshData} 
              className="w-full"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              다시 시도
            </Button>
            <p className="text-sm text-muted-foreground">
              문제가 계속되면 브라우저 캐시를 삭제하거나<br />
              잠시 후 다시 시도해주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-primary/20"></div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium">포트폴리오를 불러오는 중입니다</p>
            <p className="text-sm text-muted-foreground">
              파일이 크기 때문에 조금 시간이 걸릴 수 있습니다
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 정상 로딩 완료 시
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Awards />
      <Contact />
    </div>
  );
};

export default Index;
