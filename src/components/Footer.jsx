function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <a href="#" className="navbar__logo" onClick={(e) => e.preventDefault()}>
            <span className="navbar__logo-icon">🍕</span>
            PizzaFly
          </a>
          <p>Pizza delivered from the sky.</p>

          <div className="footer__social">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="YouTube">▶️</a>
            <a href="#" aria-label="TikTok">🎵</a>
          </div>
        </div>

        <div className="footer__links">
          <h4>Explore</h4>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
          <button onClick={onNavigate.menu}>Menu</button>
          <button onClick={onNavigate.how}>How It Works</button>
          <button onClick={onNavigate.tracking}>Track Drone</button>
          <button onClick={onNavigate.about}>About</button>
        </div>

        <div className="footer__links">
          <h4>Contact</h4>
          <a href="mailto:hello@pizzafly.app">hello@pizzafly.app</a>
          <a href="tel:+8800000000">+880 000 000 00</a>
          <span>Dhaka, Bangladesh</span>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© 2026 PizzaFly. Concept Project.</p>
      </div>
    </footer>
  );
}

export default Footer;
