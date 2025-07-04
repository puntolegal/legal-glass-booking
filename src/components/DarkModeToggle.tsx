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
          ? "glass-intense border border-orange-400/30 hover:bg-orange-500/20" 
          : "bg-white border-2 border-orange-400 hover:bg-orange-50 text-orange-600"
      }`}
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <span className="text-orange-400 text-lg">☀️</span>
      ) : (
        <span className="text-orange-600 text-lg">🌙</span>
      )}
    </Button>
  );
};

export default DarkModeToggle;