import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, BookOpen, Mic} from "lucide-react";

const NavLink: React.FC<{ to: string; children: React.ReactNode; icon?: React.ReactNode }> = ({ 
  to, 
  children, 
  icon 
}) => {
  const loc = useLocation();
  const active = loc.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        active 
          ? "bg-white text-blue-700 shadow-md font-semibold" 
          : "text-white hover:bg-white/20 hover:scale-105"
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">FD</span>
            </div>
            <div className="font-bold text-lg sm:text-xl">
              Frontdesk <span className="hidden sm:inline">— HITL Admin</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center">
            <NavLink to="/" icon={<Home size={18} />}>
              Dashboard
            </NavLink>
            <NavLink to="/knowledge" icon={<BookOpen size={18} />}>
              Knowledge
            </NavLink>
            <NavLink to="/voice" icon={<Mic size={18} />}>
              Voice Assistant
            </NavLink>
          </nav>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-blue-500 pt-4">
            <nav className="flex  flex-col items-start gap-2">
              <NavLink to="/" icon={<Home size={18} />}>
                Dashboard
              </NavLink>
              <NavLink to="/knowledge" icon={<BookOpen size={18} />}>
                Knowledge Base
              </NavLink>
              <NavLink to="/voice" icon={<Mic size={18} />}>
                Voice Assistant
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;