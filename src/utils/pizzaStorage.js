
const PIZZAS_KEY = "pizzafly_pizzas";

const defaultPizzas = [
  {
    id: "pizza-1",
    name: "Chicken BBQ",
    description: "Smoky chicken, BBQ sauce & mozzarella",
    price: 499,
    category: "Chicken",
    image: "",
    emoji: "🍕",
    available: true,
  },

  {
    id: "pizza-2",
    name: "Cheese Burst",
    description: "Extra cheese, mozzarella & creamy sauce",
    price: 449,
    category: "Cheese",
    image: "",
    emoji: "🍕",
    available: true,
  },

  {
    id: "pizza-3",
    name: "Spicy Pepperoni",
    description: "Pepperoni, chili flakes & mozzarella",
    price: 549,
    category: "Pepperoni",
    image: "",
    emoji: "🍕",
    available: true,
  },
];


// =====================================================
// GET ALL PIZZAS
// =====================================================

export const getPizzas = () => {
  try {
    const saved = localStorage.getItem(PIZZAS_KEY);

    if (saved) {
      return JSON.parse(saved);
    }

    localStorage.setItem(
      PIZZAS_KEY,
      JSON.stringify(defaultPizzas)
    );

    return defaultPizzas;

  } catch (error) {

    console.error(
      "Failed to load pizzas:",
      error
    );

    return [];
  }
};


// =====================================================
// SAVE PIZZAS
// =====================================================

export const savePizzas = (pizzas) => {
  try {

    localStorage.setItem(
      PIZZAS_KEY,
      JSON.stringify(pizzas)
    );

    return true;

  } catch (error) {

    console.error(
      "Failed to save pizzas:",
      error
    );

    return false;
  }
};


// =====================================================
// ADD PIZZA
// =====================================================

export const addPizza = (pizza) => {

  const pizzas = getPizzas();

  const newPizza = {
    ...pizza,

    id: `pizza-${Date.now()}`,

    available:
      pizza.available ?? true,

    image:
      pizza.image || "",

    emoji:
      pizza.emoji || "🍕",
  };


  const updatedPizzas = [
    ...pizzas,
    newPizza,
  ];


  savePizzas(updatedPizzas);


  // Tell Customer Website
  window.dispatchEvent(
    new Event("pizzasUpdated")
  );


  return newPizza;
};


// =====================================================
// UPDATE PIZZA
// =====================================================

export const updatePizza = (
  pizzaId,
  updatedData
) => {

  const pizzas = getPizzas();


  const updatedPizzas = pizzas.map(
    (pizza) =>
      pizza.id === pizzaId
        ? {
            ...pizza,
            ...updatedData,
          }
        : pizza
  );


  savePizzas(updatedPizzas);


  // Tell Customer Website
  window.dispatchEvent(
    new Event("pizzasUpdated")
  );


  return updatedPizzas;
};


// =====================================================
// DELETE PIZZA
// =====================================================

export const deletePizza = (
  pizzaId
) => {

  const pizzas = getPizzas();


  const updatedPizzas =
    pizzas.filter(
      (pizza) =>
        pizza.id !== pizzaId
    );


  savePizzas(updatedPizzas);


  // Tell Customer Website
  window.dispatchEvent(
    new Event("pizzasUpdated")
  );


  return updatedPizzas;
};


// =====================================================
// TOGGLE AVAILABILITY
// =====================================================

export const togglePizzaAvailability = (
  pizzaId
) => {

  const pizzas = getPizzas();


  const updatedPizzas =
    pizzas.map(
      (pizza) =>
        pizza.id === pizzaId
          ? {
              ...pizza,

              available:
                !pizza.available,
            }
          : pizza
    );


  savePizzas(updatedPizzas);


  // Tell Customer Website
  window.dispatchEvent(
    new Event("pizzasUpdated")
  );


  return updatedPizzas;
};

