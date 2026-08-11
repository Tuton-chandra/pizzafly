
import "./PizzaCard.css";

function PizzaCard({ pizza, onAdd }) {
  const stars = Math.round(pizza.rating || 0);

  return (
    <article className="pizza-card">

      {/* Image */}
      <div className="pizza-card__image">

        {pizza.image ? (
          <img
            src={pizza.image}
            alt={`${pizza.name} pizza`}
            loading="lazy"
          />
        ) : (
          <div className="pizza-card__image-fallback">
            {pizza.emoji || "🍕"}
          </div>
        )}

        {/* Tag */}
        {pizza.tag && (
          <span className="pizza-card__tag">
            {pizza.tag}
          </span>
        )}

      </div>


      {/* Body */}
      <div className="pizza-card__body">

        {/* Rating */}
        <div
          className="pizza-card__rating"
          aria-label={`Rated ${pizza.rating || 0} out of 5`}
        >
          {"★".repeat(stars)}
          {"☆".repeat(5 - stars)}

          <span className="pizza-card__rating-value">
            {pizza.rating || "New"}
          </span>
        </div>


        {/* Name */}
        <h3>{pizza.name}</h3>


        {/* Description */}
        <p>{pizza.description}</p>


        {/* Footer */}
        <div className="pizza-card__footer">

          <span className="pizza-card__price">
            ৳{Number(pizza.price || 0).toLocaleString()}
          </span>

          <button
            className="pizza-card__add"
            onClick={() => onAdd(pizza)}
            disabled={pizza.available === false}
          >
            {pizza.available === false
              ? "Unavailable"
              : "+ Add"}
          </button>

        </div>

      </div>

    </article>
  );
}

export default PizzaCard;

