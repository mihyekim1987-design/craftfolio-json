import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import portfolioData from "@/data/portfolio.json";

export const Skills = () => {
  return (
    <section id="skills" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Skills</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              My technical expertise
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioData.skills.map((skillGroup, index) => (
              <Card
                key={index}
                className="p-6 shadow-card hover:shadow-glow transition-smooth animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-bold mb-6 text-primary">
                  {skillGroup.category}
                </h3>
                <div className="space-y-4">
                  {skillGroup.items.map((skill, idx) => (
                    <div key={idx} className="group">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium group-hover:text-purple-600 transition-colors duration-300">
                          {skill.name}
                        </span>
                        <span className="text-sm text-muted-foreground group-hover:text-purple-500 transition-colors duration-300">
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
