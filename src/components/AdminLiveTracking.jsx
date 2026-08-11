
import { useEffect, useState } from "react";
import "./AdminLiveTracking.css";

import { getOrders } from "../utils/orderStorage.js";
import { getDrones } from "../utils/droneStorage.js";

function AdminLiveTracking() {
  const [orders, setOrders] = useState([]);
  const [drones, setDrones] = useState([]);

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    const loadData = () => {
      setOrders(getOrders());
      setDrones(getDrones());
    };

    loadData();

    window.addEventListener(
      "ordersUpdated",
      loadData
    );

    window.addEventListener(
      "dronesUpdated",
      loadData
    );

    return () => {
      window.removeEventListener(
        "ordersUpdated",
        loadData
      );

      window.removeEventListener(
        "dronesUpdated",
        loadData
      );
    };
  }, []);

  // =====================================================
  // ACTIVE DATA
  // =====================================================

  const activeOrders = orders.filter(
    (order) =>
      order.status === "Out for Delivery"
  );

  const activeDrones = drones.filter(
    (drone) =>
      drone.status === "In Flight"
  );

  return (
    <div className="admin-live-tracking">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="live-tracking-header">

        <div>
          <h2>
            Live Tracking
          </h2>

          <p>
            Monitor active deliveries and
            drone locations
          </p>
        </div>

        <div className="live-indicator">
          <span></span>
          Live
        </div>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="live-info-grid">

        <div className="live-info-card">

          <span>
            🚁 Active Drones
          </span>

          <strong>
            {activeDrones.length}
          </strong>

        </div>


        <div className="live-info-card">

          <span>
            📦 Active Deliveries
          </span>

          <strong>
            {activeOrders.length}
          </strong>

        </div>


        <div className="live-info-card">

          <span>
            📍 Total Orders
          </span>

          <strong>
            {orders.length}
          </strong>

        </div>

      </div>


      {/* =================================================
          MAIN TRACKING GRID
      ================================================= */}

      <div className="live-tracking-grid">

        {/* =================================================
            MAP
        ================================================= */}

        <div className="live-map-card">

          <div className="map-card-header">

            <div>
              <h3>
                Delivery Map
              </h3>

              <p>
                Current drone locations
              </p>
            </div>

          </div>


          <div className="live-map">

            {/* Roads */}

            <div className="map-road horizontal road-1"></div>

            <div className="map-road horizontal road-2"></div>

            <div className="map-road vertical road-3"></div>

            <div className="map-road vertical road-4"></div>


            {/* Map center */}

            <div className="map-center">
              📍
            </div>


            {/* Drone markers */}

            {activeDrones.map(
              (drone, index) => (

                <div
                  key={drone.id}
                  className="drone-marker"
                  style={{
                    left:
                      `${25 + (index * 22) % 60}%`,
                    top:
                      `${30 + (index * 18) % 50}%`,
                  }}
                >

                  🚁

                </div>

              )
            )}


            {/* Location labels */}

            <div
              className="map-location-label"
              style={{
                top: "20%",
                left: "15%",
              }}
            >
              Dhaka
            </div>


            <div
              className="map-location-label"
              style={{
                top: "55%",
                left: "62%",
              }}
            >
              Dhanmondi
            </div>


            <div
              className="map-location-label"
              style={{
                top: "30%",
                left: "72%",
              }}
            >
              Gulshan
            </div>

          </div>

        </div>


        {/* =================================================
            DRONE PANEL
        ================================================= */}

        <div className="live-drone-panel">

          <h3>
            Active Drones
          </h3>


          {activeDrones.length === 0 ? (

            <div className="tracking-empty">

              <div>
                🚁
              </div>

              <strong>
                No Active Drones
              </strong>

              <small>
                Active drones will appear here.
              </small>

            </div>

          ) : (

            activeDrones.map(
              (drone) => (

                <div
                  className="live-drone-item"
                  key={drone.id}
                >

                  <div className="live-drone-icon">
                    🚁
                  </div>


                  <div className="live-drone-info">

                    <strong>
                      {drone.id}
                    </strong>

                    <small>
                      📍{" "}
                      {drone.location ||
                        "Unknown"}
                    </small>

                  </div>


                  <span
                    className={`live-drone-status ${String(
                      drone.status || ""
                    )
                      .toLowerCase()
                      .replace(
                        /\s+/g,
                        "-"
                      )}`}
                  >
                    {drone.status ||
                      "Unknown"}
                  </span>

                </div>

              )
            )

          )}

        </div>

      </div>


      {/* =================================================
          ACTIVE DELIVERIES
      ================================================= */}

      <div className="live-info-card active-deliveries-card">

        <div className="map-card-header">

          <div>
            <h3>
              Active Deliveries
            </h3>

            <p>
              Orders currently in transit
            </p>
          </div>

        </div>


        <div className="delivery-list">

          {activeOrders.length === 0 ? (

            <div className="tracking-empty">

              <div>
                📦
              </div>

              <strong>
                No active deliveries
              </strong>

              <small>
                Active delivery orders will
                appear here.
              </small>

            </div>

          ) : (

            activeOrders.map(
              (order) => (

                <div
                  className="live-drone-item"
                  key={order.id}
                >

                  <div className="live-drone-icon">
                    📦
                  </div>


                  <div className="live-drone-info">

                    <strong>
                      {order.id}
                    </strong>

                    <small>
                      {order.name ||
                        "Unknown Customer"}
                    </small>

                    <small>
                      📍{" "}
                      {order.address ||
                        "Unknown Address"}
                    </small>

                  </div>


                  <div className="live-drone-status">

                    {order.eta
                      ? `${order.eta} min`
                      : "—"}

                  </div>

                </div>

              )
            )

          )}

        </div>

      </div>


      {/* =================================================
          DRONE FLEET
      ================================================= */}

      <div className="live-info-card tracking-drone-card">

        <div className="map-card-header">

          <div>
            <h3>
              Drone Fleet
            </h3>

            <p>
              Current fleet status
            </p>
          </div>

        </div>


        <div className="tracking-drone-grid">

          {drones.length === 0 ? (

            <div className="tracking-empty">
              No drones available.
            </div>

          ) : (

            drones.map(
              (drone) => (

                <div
                  className="live-drone-item"
                  key={drone.id}
                >

                  <div className="live-drone-icon">
                    🚁
                  </div>


                  <div className="live-drone-info">

                    <strong>
                      {drone.id}
                    </strong>

                    <small>
                      📍{" "}
                      {drone.location ||
                        "Unknown"}
                    </small>

                  </div>


                  <div
                    className="tracking-battery"
                  >

                    <div className="battery-track">

                      <span
                        style={{
                          width:
                            `${Math.min(
                              100,
                              Math.max(
                                0,
                                Number(
                                  drone.battery ||
                                    0
                                )
                              )
                            )}%`,
                        }}
                      ></span>

                    </div>

                    <small>
                      {drone.battery || 0}%
                    </small>

                  </div>


                  <span
                    className={`live-drone-status ${String(
                      drone.status || ""
                    )
                      .toLowerCase()
                      .replace(
                        /\s+/g,
                        "-"
                      )}`}
                  >
                    {drone.status ||
                      "Unknown"}
                  </span>

                </div>

              )
            )

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminLiveTracking;
