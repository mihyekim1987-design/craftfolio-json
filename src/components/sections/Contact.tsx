import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Globe,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePortfolio } from "@/contexts/PortfolioContext";

export const Contact = () => {
  const { data } = usePortfolio();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const { email, phone, location, github, linkedin, website } =
    data.personal;

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const contactItems = [
    { icon: Mail, label: "Email", value: email, link: `mailto:${email}` },
    { icon: Phone, label: "Phone", value: phone, link: `tel:${phone}` },
    { icon: MapPin, label: "Location", value: location },
  ];

  const socialLinks = [
    { icon: Github, label: "GitHub", href: github },
    { icon: Linkedin, label: "LinkedIn", href: linkedin },
    { icon: Globe, label: "Website", href: website },
  ];

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Get In Touch</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Let's create something amazing together
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {contactItems.map((item, index) => (
              <Card
                key={index}
                className="p-6 text-center shadow-card hover:shadow-glow transition-smooth animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <item.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">{item.label}</h3>
                {item.link ? (
                  <a
                    href={item.link}
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                )}
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <Card className="p-8 text-center shadow-card animate-slide-up">
            <h3 className="text-2xl font-bold mb-4">
              Ready to start a project?
            </h3>
            <p className="text-muted-foreground mb-6">
              I'm always open to discussing new projects, creative ideas, or
              opportunities.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Button
                size="lg"
                className="gradient-primary shadow-glow"
                asChild
              >
                <a href={`mailto:${email}`}>Send Email</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={copyEmail}
                className="gap-2"
              >
                {copiedEmail ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Email
                  </>
                )}
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-4">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="hover:text-primary transition-smooth"
                  asChild
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-16 text-sm text-muted-foreground">
        <p>© 2025 {portfolioData.personal.name}. All rights reserved.</p>
      </div>
    </section>
  );
};
