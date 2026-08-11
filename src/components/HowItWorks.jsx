const steps = [
  {
    icon: '🍕',
    title: 'Order',
    description: 'Customer selects pizza and places an order.',
  },
  {
    icon: '👨‍🍳',
    title: 'Prepare',
    description: 'Restaurant prepares the pizza fresh, in-house.',
  },
  {
    icon: '🚁',
    title: 'Drone Pickup',
    description: 'A PizzaFly drone collects the order from the restaurant.',
  },
  {
    icon: '🏠',
    title: 'Delivery',
    description: "The drone flies directly to the customer's location.",
  },
];

function HowItWorks() {
  return (
    <section className="section how-it-works">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">WHY PIZZAFLY?</span>
          <h2>Delivery, Reimagined.</h2>
          <p>
            Four simple steps take your order from the kitchen to your doorstep — faster
            than traditional delivery ever could.
          </p>
        </div>

        <div className="timeline">
          <div className="timeline__line" aria-hidden="true"></div>
          {steps.map((step, index) => (
            <div className="timeline__step" key={step.title}>
              <div className="timeline__marker">
                <span className="timeline__icon">{step.icon}</span>
              </div>
              <span className="timeline__index">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
