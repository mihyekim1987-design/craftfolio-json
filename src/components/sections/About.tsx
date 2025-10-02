import { Card } from "@/components/ui/card";
import { Users, Briefcase, Award } from "lucide-react";
import { usePortfolio } from "@/contexts/PortfolioContext";

export const About = () => {
  const { data, isLoading } = usePortfolio();

  // 로딩 중이거나 데이터가 없을 때
  if (isLoading || !data?.personal) {
    return (
      <section id="about" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </section>
    );
  }

  const { name, bio, stats } = data.personal;

  const statItems = [
    { icon: Briefcase, label: "Years Experience", value: stats.experience },
    { icon: Award, label: "Projects Completed", value: stats.projects },
    { icon: Users, label: "Happy Clients", value: stats.clients },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">About Me</span>
            </h2>
            <p className="text-lg text-muted-foreground">{name}</p>
          </div>

          {/* Bio */}
          <Card className="p-8 mb-8 shadow-card hover:shadow-glow transition-smooth animate-slide-up">
            <p className="text-lg leading-relaxed text-foreground/80">{bio}</p>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
            {statItems.map((item, index) => (
              <Card
                key={index}
                className="p-6 text-center shadow-card hover:shadow-glow transition-smooth hover:scale-105"
              >
                <item.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-gradient mb-2">
                  {item.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.label}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
