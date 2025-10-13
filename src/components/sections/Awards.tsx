import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Trophy, GraduationCap } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";

const categoryConfig = {
  award: { icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  certification: {
    icon: Award,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  training: {
    icon: GraduationCap,
    color: "text-green-500",
    bg: "bg-green-500/10",
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

          {/* Awards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.awards.map((award, index) => {
              const config =
                categoryConfig[
                award.category as keyof typeof categoryConfig
                ];
              const Icon = config.icon;

              return (
                <Card
                  key={award.id}
                  className="p-6 shadow-card hover:shadow-glow transition-smooth animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${config.bg}`}>
                      <Icon className={`h-6 w-6 ${config.color}`} />
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
      </div>
    </section>
  );
};
