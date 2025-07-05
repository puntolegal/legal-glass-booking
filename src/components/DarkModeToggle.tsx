import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user has a preference stored
    const stored = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const shouldBeDark = stored ? JSON.parse(stored) : prefersDark;
    setIsDarkMode(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
    
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDarkMode}
      className={`rounded-full transition-all duration-300 ${
        isDarkMode 
          ? "glass-intense border border-primary/30 hover:bg-primary/20" 
          : "bg-card border-2 border-primary hover:bg-primary/5 text-primary"
      }`}
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <span className="text-primary text-lg">☀️</span>
      ) : (
        <span className="text-primary text-lg">🌙</span>
      )}
    </Button>
  );
};

export default DarkModeToggle;