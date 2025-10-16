import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { usePortfolio } from "@/contexts/PortfolioContext";

export const Skills = () => {
  const { data } = usePortfolio();

  if (!data?.skills) {
    return (
      <section id="skills" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Skills</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              My technical expertise
            </p>
          </div>

          {/* Skills Grid - 2개 카테고리만 가운데 정렬 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {data.skills.map((skillGroup, index) => (
              <Card
                key={index}
                className="p-6 shadow-card hover:shadow-glow transition-smooth animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-bold mb-6 text-primary text-center">
                  {skillGroup.category}
                </h3>
                <div className="space-y-4">
                  {skillGroup.items.map((skill, idx) => (
                    <div key={idx} className="group">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium group-hover:text-primary transition-colors duration-300">
                          {skill.name}
                        </span>
                        <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">
                          {skill.level}%
                        </span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
