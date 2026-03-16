"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Bell, Globe, LogOut, User } from "lucide-react";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@devalaya/shared/i18n";
import { useState } from "react";

export function Header() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en");

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function handleLanguageChange(lang: SupportedLanguage) {
    setCurrentLang(lang);
    setShowLangMenu(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("i18nextLng", lang);
      window.location.reload();
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Temple Administration</h2>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLangMenu(!showLangMenu)}
            title="Change language"
          >
            <Globe className="h-4 w-4" />
          </Button>
          {showLangMenu && (
            <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-md border bg-card shadow-lg">
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                <button
                  key={code}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm hover:bg-accent",
                    currentLang === code && "bg-accent font-medium"
                  )}
                  onClick={() => handleLanguageChange(code as SupportedLanguage)}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
