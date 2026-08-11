
import { useEffect, useState } from "react";
import PizzaCard from "./PizzaCard.jsx";
import { getPizzas } from "../utils/pizzaStorage.js";
import "./PizzaMenu.css";

function PizzaMenu({ onAddToCart }) {
  const [pizzas, setPizzas] = useState([]);

  // Load pizzas from localStorage
  useEffect(() => {
    const loadPizzas = () => {
      const savedPizzas = getPizzas();
      setPizzas(savedPizzas);
    };

    loadPizzas();

    // Listen for Admin changes
    window.addEventListener("pizzasUpdated", loadPizzas);

    return () => {
      window.removeEventListener(
        "pizzasUpdated",
        loadPizzas
      );
    };
  }, []);

  return (
    <section className="menu">

      <div className="menu__container">

        {/* Heading */}
        <div className="menu__header">

          <span className="section-label">
            THE MENU
          </span>

          <h2>
            Made For Pizza Lovers.
          </h2>

          <p>
            Signature pizzas, made fresh and ready for takeoff.
          </p>

        </div>


        {/* Pizza Grid */}
        <div className="menu__grid">

          {pizzas.length === 0 ? (

            <div className="menu__empty">

              <div>🍕</div>

              <h3>
                No pizzas available
              </h3>

              <p>
                Please check back soon.
              </p>

            </div>

          ) : (

            pizzas
              .filter((pizza) => pizza.available)
              .map((pizza) => (

                <PizzaCard
                  key={pizza.id}
                  pizza={pizza}
                  onAdd={onAddToCart}
                />

              ))

          )}

        </div>

      </div>

    </section>
  );
}

export default PizzaMenu;
