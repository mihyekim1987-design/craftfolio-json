import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, CheckCircle2 } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";

export const Experience = () => {
  const { data, isLoading } = usePortfolio();

  if (isLoading || !data?.experience) {
    return (
      <section id="experience" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </section>
    );
  }
  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Experience</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              My professional journey
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent hidden md:block" />

            <div className="space-y-8">
              {data.experience.map((exp, index) => (
                <div
                  key={exp.id}
                  className="relative animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-primary shadow-glow hidden md:block" />

                  <Card className="md:ml-20 p-6 shadow-card hover:shadow-glow transition-smooth">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="flex items-start gap-3 mb-2 md:mb-0">
                        <Briefcase className="h-6 w-6 text-primary mt-1 md:hidden" />
                        <div>
                          <h3 className="text-xl font-bold">{exp.company}</h3>
                          <p className="text-primary font-medium">
                            {exp.position}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="w-fit">
                        {exp.period}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-4">
                      {exp.description}
                    </p>

                    <div className="space-y-2">
                      {exp.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80">
                            {achievement}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
