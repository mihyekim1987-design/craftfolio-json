import { Menu, X, Moon, Sun } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Awards", href: "#awards" },
  { label: "Contact", href: "#contact" },
];

export const Navigation = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // 관리자 모드 관련 상태
  const [logoClickCount, setLogoClickCount] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = navItems.map((item) => item.href.substring(1));
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // 로고 클릭 핸들러 - 관리자 모드 진입
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);

    // 기존 타이머 클리어
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    // 5번 클릭 시 관리자 모드 진입
    if (newCount === 5) {
      toast({
        title: "🎉 관리자 모드 활성화!",
        description: "관리자 페이지로 이동합니다...",
        duration: 2000,
      });

      setTimeout(() => {
        navigate('/admin');
      }, 1000);

      setLogoClickCount(0);
      return;
    }

    // 진행 상황 알림
    if (newCount >= 3) {
      toast({
        title: `${newCount}/5 클릭`,
        description: `관리자 모드까지 ${5 - newCount}번 더 클릭하세요`,
        duration: 1500,
      });
    }

    // 3초 후 카운트 리셋
    clickTimeoutRef.current = setTimeout(() => {
      setLogoClickCount(0);
    }, 3000);
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? "bg-background/80 backdrop-blur-md shadow-card"
        : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleLogoClick}
            className="text-2xl font-bold text-gradient hover:scale-105 transition-smooth cursor-pointer select-none"
            title="로고를 5번 클릭하면 관리자 모드에 진입합니다"
          >
            Portfolio
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-smooth hover:text-primary ${activeSection === item.href.substring(1)
                  ? "text-primary"
                  : "text-foreground/70"
                  }`}
              >
                {item.label}
              </a>
            ))}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="ml-4"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border animate-fade-in">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2 text-sm font-medium transition-smooth hover:text-primary ${activeSection === item.href.substring(1)
                  ? "text-primary"
                  : "text-foreground/70"
                  }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
