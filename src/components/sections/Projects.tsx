import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, Github } from "lucide-react";
import portfolioData from "@/data/portfolio.json";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  tech: string[];
  contribution: string;
  impact: string;
  links: {
    demo?: string;
    github?: string;
  };
}

export const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Featured work and achievements
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {portfolioData.projects.map((project, index) => (
            <Card
              key={project.id}
              className="overflow-hidden shadow-card hover:shadow-glow transition-smooth cursor-pointer group animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-4">
                  <p className="text-sm text-foreground">Click for details</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-smooth">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Project Detail Modal */}
        <Dialog
          open={!!selectedProject}
          onOpenChange={() => setSelectedProject(null)}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedProject && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {selectedProject.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">
                      {selectedProject.description}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Technology Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech.map((tech, idx) => (
                        <Badge key={idx} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">My Contribution</h4>
                    <p className="text-muted-foreground">
                      {selectedProject.contribution}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Impact & Results</h4>
                    <p className="text-muted-foreground">
                      {selectedProject.impact}
                    </p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    {selectedProject.links.demo && (
                      <Button asChild className="gradient-primary">
                        <a
                          href={selectedProject.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {selectedProject.links.github && (
                      <Button variant="outline" asChild>
                        <a
                          href={selectedProject.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4 mr-2" />
                          Source Code
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
