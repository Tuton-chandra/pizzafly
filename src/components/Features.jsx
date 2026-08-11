const features = [
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Smart routes help reduce delivery time to minutes, not hours.',
  },
  {
    icon: '🚁',
    title: 'Drone Powered',
    description: 'Autonomous drone technology enables modern, contact-free delivery.',
  },
  {
    icon: '🍕',
    title: 'Fresh & Hot',
    description: 'Special insulated delivery boxes keep every pizza at the perfect temperature.',
  },
  {
    icon: '📍',
    title: 'Live Tracking',
    description: 'Monitor your delivery journey in real time, from kitchen to doorstep.',
  },
];

function Features() {
  return (
    <section className="section features">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">BUILT DIFFERENT</span>
          <h2>Engineered for speed and freshness.</h2>
        </div>

        <div className="features__grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.title}>
              <div className="feature-card__icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
