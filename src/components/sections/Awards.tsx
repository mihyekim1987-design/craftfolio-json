import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Trophy, GraduationCap } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";

const categoryConfig = {
  award: { 
    icon: Trophy, 
    color: "text-yellow-500", 
    bg: "bg-yellow-500/10",
    title: "수상 경력",
    order: 1
  },
  certification: {
    icon: Award,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    title: "자격증",
    order: 2
  },
  training: {
    icon: GraduationCap,
    color: "text-green-500",
    bg: "bg-green-500/10",
    title: "교육/훈련",
    order: 3
  },
};

export const Awards = () => {
  const { data } = usePortfolio();

  if (!data?.awards) {
    return (
      <section id="awards" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </section>
    );
  }

  // 연도를 추출하는 헬퍼 함수
  const extractYear = (period: string): number => {
    const match = period.match(/(\d{4})/);
    return match ? parseInt(match[1]) : 0;
  };

  // 카테고리별로 그룹화하고 최신순으로 정렬
  const groupedAwards = Object.entries(categoryConfig).map(([category, config]) => {
    const items = data.awards
      .filter(award => award.category === category)
      .sort((a, b) => extractYear(b.period) - extractYear(a.period)); // 최신순 정렬
    
    return {
      category,
      config,
      items
    };
  }).filter(group => group.items.length > 0); // 항목이 있는 카테고리만 표시

  return (
    <section id="awards" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Awards & Certifications</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Recognition and achievements
            </p>
          </div>

          {/* 카테고리별로 분류된 Awards */}
          <div className="space-y-12">
            {groupedAwards.map((group, groupIndex) => (
              <div key={group.category} className="animate-fade-in" style={{ animationDelay: `${groupIndex * 200}ms` }}>
                {/* 카테고리 제목 */}
                <div className="flex items-center gap-3 mb-6">
                  <group.config.icon className={`h-6 w-6 ${group.config.color}`} />
                  <h3 className="text-2xl font-bold">{group.config.title}</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent ml-4" />
                </div>

                {/* Awards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {group.items.map((award, index) => {
                    const Icon = group.config.icon;

                    return (
                      <Card
                        key={award.id}
                        className="p-6 shadow-card hover:shadow-glow transition-smooth animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${group.config.bg}`}>
                            <Icon className={`h-6 w-6 ${group.config.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-bold">{award.title}</h3>
                              <Badge variant="outline" className="ml-2">
                                {award.period}
                              </Badge>
                            </div>
                            <p className="text-sm text-primary font-medium mb-2">
                              {award.institution}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {award.details}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
