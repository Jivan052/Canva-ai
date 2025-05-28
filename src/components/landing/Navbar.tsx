import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart2, Settings2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import UseCasesDropdown from "@/components/UseCasesDropdown";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // Toggle menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Close on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="border-b border-border py-4 px-6 md:px-10 sticky top-0 z-50 bg-background">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
            <BarChart2 className="text-white w-5 h-5" />
          </div>
          <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            AI Data Canvas
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
        <Link to="/#how-it-works" className="text-sm hover:underline"> How It Works</Link>

            <Link to="/#how-we-help-you" className="text-sm hover:underline">
                Services
            </Link> 

          <UseCasesDropdown />
          <Link to="/manual-tools">
            <Button variant="outline" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Manual Data Tools
            </Button>
          </Link>
          <Link to="/demo-ai">
            <Button variant="outline" className="gap-2">
              <Settings2 className="h-4 w-4" />
              DemoAI
            </Button>
          </Link>
        </nav>

        {/* Hamburger */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button asChild>
            <Link to="/dashboard">Get Started</Link>
          </Button>
        </div>
      </div>

      {/* Mobile Pop-up Panel */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 flex justify-end md:hidden">
          <div
            ref={mobileMenuRef}
            className="w-80 bg-white h-1/2 px-6 py-2  mt-6 shadow-xl overflow-y-auto rounded-lg"
          >
            <div className="flex justify-end mb-4">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <a href="/#how-it-works" className="block text-sm hover:underline">
                How It Works
              </a>
              <a href="/#how-we-help-you" className="block text-sm hover:underline">
                Services
              </a>
              <UseCasesDropdown />
              <Link to="/manual-tools">
                <Button variant="outline" className="w-full gap-2">
                  <Settings2 className="h-4 w-4" />
                  Manual Data Tools
                </Button>
              </Link>
              <Link to="/demo-ai">
                <Button variant="outline" className="w-full gap-2">
                  <Settings2 className="h-4 w-4" />
                  DemoAI
                </Button>
              </Link>
              <Button asChild className="w-full">
                <Link to="/dashboard">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
