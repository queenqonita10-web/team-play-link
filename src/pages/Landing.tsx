import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Trophy, Users, BarChart3, Link2, Smartphone } from "lucide-react";

export default function Landing() {
  const { t } = useLanguage();

  const features = [
    { icon: Link2, title: t.landing.featureIntegration, desc: t.landing.featureIntegrationDesc },
    { icon: BarChart3, title: t.landing.featureTracking, desc: t.landing.featureTrackingDesc },
    { icon: Trophy, title: t.landing.featureCompetition, desc: t.landing.featureCompetitionDesc },
    { icon: Smartphone, title: t.landing.featureParent, desc: t.landing.featureParentDesc },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">FG</span>
            </div>
            <span className="font-bold text-lg">{t.common.appName}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm">{t.common.login}</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">{t.common.register}</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            {t.landing.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t.landing.heroSubtitle}
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link to="/login" state={{ defaultRole: "admin_ssb" }}>
              <Card className="group cursor-pointer border-2 hover:border-primary transition-all hover:shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t.landing.ctaSSB}</h3>
                  <p className="text-sm text-muted-foreground">{t.landing.ctaSSBDesc}</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/login" state={{ defaultRole: "admin_eo" }}>
              <Card className="group cursor-pointer border-2 hover:border-secondary transition-all hover:shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                    <Trophy className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t.landing.ctaEO}</h3>
                  <p className="text-sm text-muted-foreground">{t.landing.ctaEODesc}</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <f.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 Football Grassroots. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
