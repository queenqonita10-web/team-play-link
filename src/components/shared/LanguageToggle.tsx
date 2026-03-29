import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "id" ? "en" : "id")}
      className="gap-1.5 text-xs font-medium"
    >
      <Globe className="h-4 w-4" />
      {language === "id" ? "EN" : "ID"}
    </Button>
  );
}
