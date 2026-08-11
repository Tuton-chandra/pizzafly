const safetyPoints = [
  { icon: '🛡️', title: 'Safe Delivery Zones', desc: 'Deliveries planned within mapped, approved zones.' },
  { icon: '🧭', title: 'Automated Route Planning', desc: 'Routes calculated to avoid congestion and obstacles.' },
  { icon: '👁️', title: 'Obstacle Awareness', desc: 'Sensors designed to detect and avoid obstacles in flight.' },
  { icon: '🌦️', title: 'Weather Monitoring', desc: 'Flights adjusted or paused in unsafe weather conditions.' },
  { icon: '🔋', title: 'Battery Monitoring', desc: 'Continuous battery checks to ensure safe round trips.' },
  { icon: '↩️', title: 'Return-to-Base', desc: 'Automatic return-to-base if a flight cannot be completed safely.' },
  { icon: '🧑‍💻', title: 'Human Supervision', desc: 'Every flight plan is designed to be supervised by a human operator.' },
];

function About() {
  return (
    <section className="section about">
      <div className="container">
        <div className="about__grid">
          <div>
            <span className="eyebrow">ABOUT PIZZAFLY</span>
            <h2>The Future of Pizza Delivery</h2>
            <p className="about__lead">
              PizzaFly is a futuristic food delivery concept that combines pizza,
              automation and drone technology to imagine a faster, smarter delivery
              experience.
            </p>
            <p className="about__note">
              Drone delivery shown here is a technology concept and prototype. Real-world
              deployment would require appropriate aviation, safety and regulatory
              approvals.
            </p>
          </div>

          <div className="safety-card">
            <h3>Responsible Technology</h3>
            <p className="safety-card__note">Planned safety features for future deployment:</p>
            <ul className="safety-list">
              {safetyPoints.map((point) => (
                <li key={point.title}>
                  <span>{point.icon}</span>
                  <div>
                    <strong>{point.title}</strong>
                    <p>{point.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
