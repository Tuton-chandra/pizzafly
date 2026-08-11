function Hero({ onOrderClick, onTrackClick }) {
  return (
    <section className="hero">
      <div className="hero__glow" aria-hidden="true"></div>
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="eyebrow">🚁 NEXT-GEN PIZZA DELIVERY</span>

          <h1 className="hero__headline">
            Your Pizza.
            <br />
            <span className="hero__highlight">From The Sky.</span>
          </h1>

          <p className="hero__subtitle">
            Fresh, hot and delicious pizza delivered straight to your doorstep by our
            smart drone delivery system.
          </p>

          <div className="hero__actions">
            <button className="btn btn-primary" onClick={onOrderClick}>
              🍕 Order Pizza
            </button>
            <button className="btn btn-secondary" onClick={onTrackClick}>
              🚁 Track Drone
            </button>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-value">10 min</span>
              <span className="hero__stat-label">Average Delivery</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-value">100%</span>
              <span className="hero__stat-label">Fresh &amp; Hot</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-value">24/7</span>
              <span className="hero__stat-label">Order Anytime</span>
            </div>
          </div>
        </div>

        <div className="hero__visual">
          <div className="drone-scene">
            <div className="drone-scene__ring drone-scene__ring--1" aria-hidden="true"></div>
            <div className="drone-scene__ring drone-scene__ring--2" aria-hidden="true"></div>

            <div className="drone" role="img" aria-label="Autonomous delivery drone carrying a pizza box">
              <div className="drone__arm drone__arm--left">
                <div className="drone__rotor"></div>
              </div>
              <div className="drone__arm drone__arm--right">
                <div className="drone__rotor"></div>
              </div>
              <div className="drone__body">
                <span className="drone__eye"></span>
              </div>
              <div className="drone__cable"></div>
              <div className="drone__box">🍕</div>
            </div>

            <div className="hud-card hud-card--live">
              <div className="hud-card__row">
                <span className="hud-card__dot"></span>
                LIVE DELIVERY
              </div>
              <p className="hud-card__title">Drone #PF-102</p>
              <div className="hud-card__meta">
                <span className="hud-card__status">● In Flight</span>
                <span>Battery 72%</span>
              </div>
            </div>

            <div className="hud-card hud-card--eta">
              <div className="hud-card__row">📍 On The Way</div>
              <p className="hud-card__title">650m away</p>
              <div className="hud-card__meta">
                <span>ETA 03:24</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
