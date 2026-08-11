import { useEffect, useState } from 'react';

const timelineSteps = [
  'Order Confirmed',
  'Pizza Preparing',
  'Drone Assigned',
  'Drone In Flight',
  'Arriving Soon',
  'Delivered',
];

function getStepFromProgress(progress) {
  if (progress < 8) return 0;
  if (progress < 24) return 1;
  if (progress < 36) return 2;
  if (progress < 90) return 3;
  if (progress < 100) return 4;
  return 5;
}

function Tracking({ order, address, onAddressChange }) {
  const [progress, setProgress] = useState(0);

  // Restart the simulation whenever a new order comes in
  useEffect(() => {
    if (!order) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 1));
    }, 260);
    return () => clearInterval(interval);
  }, [order?.id]);

  const stepIndex = order ? getStepFromProgress(progress) : -1;
  const isFlying = stepIndex === 3;
  const isDelivered = stepIndex === 5;

  // Frontend simulation values — no real GPS/backend involved
  const flightProgress = isFlying ? (progress - 36) / (90 - 36) : stepIndex > 3 ? 1 : 0;
  const distance = order ? Math.max(0, Math.round(650 * (1 - flightProgress))) : 650;
  const etaSeconds = order ? Math.max(0, Math.round(204 * (1 - flightProgress))) : 204;
  const etaLabel = `${String(Math.floor(etaSeconds / 60)).padStart(2, '0')}:${String(
    etaSeconds % 60
  ).padStart(2, '0')}`;
  const battery = order ? Math.max(61, Math.round(82 - flightProgress * 21)) : 72;
  const speed = order && isFlying ? 38 + Math.round(Math.sin(progress / 3) * 5) : order ? 0 : 42;

  const status = order ? (isDelivered ? 'Delivered' : timelineSteps[stepIndex]) : 'Standing By';

  return (
    <section className="section tracking">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">🚁 LIVE TRACKING</span>
          <h2>Know Where Your Pizza Is.</h2>
          <p>Track your PizzaFly drone from the restaurant to your doorstep.</p>
        </div>

        <div className="tracking__layout">
          <div className="tracking-map">
            <div className="tracking-map__grid" aria-hidden="true"></div>

            <div className="tracking-map__route">
              <div className="tracking-map__node">
                <span className="tracking-map__node-icon">🏪</span>
                <span>Restaurant</span>
              </div>

              <div className="tracking-map__path">
                <div
                  className="tracking-map__path-fill"
                  style={{ width: `${isFlying ? flightProgress * 100 : stepIndex > 3 ? 100 : 0}%` }}
                ></div>
                <div
                  className={`tracking-map__drone ${isFlying ? 'tracking-map__drone--flying' : ''}`}
                  style={{
                    left: `${
                      isFlying ? flightProgress * 100 : stepIndex > 3 ? 100 : 0
                    }%`,
                  }}
                >
                  🚁
                </div>
              </div>

              <div className="tracking-map__node">
                <span className="tracking-map__node-icon">🏠</span>
                <span>Customer</span>
              </div>
            </div>

            <div className="tracking-map__address">
              <span>📍</span>
              <input
                type="text"
                value={address}
                onChange={(e) => onAddressChange(e.target.value)}
                aria-label="Delivery address"
                placeholder="Delivery address"
              />
            </div>
          </div>

          <div className="tracking-panel">
            <div className="tracking-panel__header">
              <div>
                <p className="tracking-panel__label">DRONE</p>
                <p className="tracking-panel__drone-id">PF-102</p>
              </div>
              <span className={`tracking-panel__status ${isDelivered ? 'tracking-panel__status--done' : ''}`}>
                ● {status}
              </span>
            </div>

            <div className="tracking-panel__stats">
              <div className="tracking-stat">
                <span>Battery</span>
                <strong>{battery}%</strong>
              </div>
              <div className="tracking-stat">
                <span>Distance</span>
                <strong>{distance}m</strong>
              </div>
              <div className="tracking-stat">
                <span>ETA</span>
                <strong>{isDelivered ? '00:00' : etaLabel}</strong>
              </div>
              <div className="tracking-stat">
                <span>Speed</span>
                <strong>{speed} km/h</strong>
              </div>
            </div>

            <ul className="tracking-timeline">
              {timelineSteps.map((step, index) => {
                const state = !order
                  ? 'pending'
                  : index < stepIndex || (index === stepIndex && isDelivered)
                  ? 'done'
                  : index === stepIndex
                  ? 'active'
                  : 'pending';
                return (
                  <li key={step} className={`tracking-timeline__item tracking-timeline__item--${state}`}>
                    <span className="tracking-timeline__marker">
                      {state === 'done' ? '✓' : state === 'active' ? '●' : '○'}
                    </span>
                    {step}
                  </li>
                );
              })}
            </ul>

            {!order && (
              <p className="tracking-panel__hint">
                Place an order to activate live tracking. This preview shows a standing-by drone.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Tracking;
