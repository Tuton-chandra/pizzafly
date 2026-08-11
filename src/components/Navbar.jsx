import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

function Navbar({
  cartCount,
  onCartClick,
  onLoginClick,
  onOrderClick,
  onNavigate,
})  {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNav = (fn) => {
    fn();
    setIsMobileOpen(false);
  };

  return (
    <header
      className={`navbar ${
        isScrolled ? "navbar--scrolled" : ""
      }`}
    >
      <div className="container navbar__inner">

        {/* ================= LOGO ================= */}
        <button
          className="navbar__logo navbar__logo-button"
          onClick={() =>
            handleNav(() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            )
          }
        >
          <span className="navbar__logo-icon">🍕</span>
          PizzaFly
        </button>

        {/* ================= NAVIGATION ================= */}
        <nav
          className={`navbar__links ${
            isMobileOpen ? "navbar__links--open" : ""
          }`}
        >
          <button
            onClick={() =>
              handleNav(() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              )
            }
          >
            Home
          </button>

          <button onClick={() => handleNav(onNavigate.menu)}>
            Menu
          </button>

          <button onClick={() => handleNav(onNavigate.how)}>
            How It Works
          </button>

          <button onClick={() => handleNav(onNavigate.tracking)}>
            Track Drone
          </button>

          <button onClick={() => handleNav(onNavigate.about)}>
            About
          </button>

          {/* Mobile Actions */}
          <div className="navbar__mobile-actions">

            {/* Mobile Theme Toggle */}
            <button
              className="navbar__theme-toggle navbar__theme-toggle--mobile"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <span className="navbar__theme-icon">
                {theme === "light" ? "🌙" : "☀️"}
              </span>

              <span>
                {theme === "light"
                  ? "Dark Mode"
                  : "Light Mode"}
              </span>
            </button>

            <button
              className="btn btn-secondary btn-block"
              onClick={() => handleNav(onLoginClick)}
            >
              Login
            </button>

            <button
              className="btn btn-primary btn-block"
              onClick={() => handleNav(onOrderClick)}
            >
              Order Now
            </button>
          </div>
        </nav>

        {/* ================= RIGHT ACTIONS ================= */}
        <div className="navbar__actions">

          {/* Cart */}
          <button
            className="navbar__cart"
            onClick={onCartClick}
            aria-label="Open cart"
          >
            🛒

            {cartCount > 0 && (
              <span className="navbar__cart-badge">
                {cartCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            className="navbar__theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={
              theme === "light"
                ? "Switch to dark mode"
                : "Switch to light mode"
            }
          >
            <span className="navbar__theme-icon">
              {theme === "light" ? "🌙" : "☀️"}
            </span>
          </button>

          {/* Login */}
          <button
            className="btn btn-secondary"
            onClick={onLoginClick}
          >
            Login
          </button>

          {/* Order */}
          <button
            className="btn btn-primary"
            onClick={onOrderClick}
          >
            Order Now
          </button>
        </div>

        {/* ================= MOBILE HAMBURGER ================= */}
        <button
          className={`navbar__hamburger ${
            isMobileOpen
              ? "navbar__hamburger--open"
              : ""
          }`}
          onClick={() =>
            setIsMobileOpen((value) => !value)
          }
          aria-label="Toggle menu"
          aria-expanded={isMobileOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;