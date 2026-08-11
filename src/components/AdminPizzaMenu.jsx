import { useEffect, useState } from "react";
import "./AdminPizzaMenu.css";

import {
  getPizzas,
  addPizza,
  updatePizza,
  deletePizza,
  togglePizzaAvailability,
} from "../utils/pizzaStorage.js";

function AdminPizzaMenu() {
  const [pizzas, setPizzas] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingPizza, setEditingPizza] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Chicken",
    emoji: "🍕",
    image: "",
  });

  // Load pizzas
  useEffect(() => {
    setPizzas(getPizzas());
  }, []);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Allow image only
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Limit image size to 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // Add Pizza
  const handleAddPizza = () => {
    setEditingPizza(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Chicken",
      emoji: "🍕",
      image: "",
    });

    setShowForm(true);
  };

  // Edit Pizza
  const handleEditPizza = (pizza) => {
    setEditingPizza(pizza);

    setFormData({
      name: pizza.name || "",
      description: pizza.description || "",
      price: pizza.price || "",
      category: pizza.category || "Chicken",
      emoji: pizza.emoji || "🍕",
      image: pizza.image || "",
    });

    setShowForm(true);
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter pizza name.");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    if (editingPizza) {
      const updatedPizzas = updatePizza(
        editingPizza.id,
        formData
      );

      setPizzas(updatedPizzas);
    } else {
      const newPizza = addPizza(formData);

      setPizzas((prev) => [
        ...prev,
        newPizza,
      ]);
    }

    setShowForm(false);
  };

  // Delete
  const handleDelete = (pizzaId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pizza?"
    );

    if (!confirmDelete) return;

    const updatedPizzas = deletePizza(pizzaId);

    setPizzas(updatedPizzas);
  };

  // Availability
  const handleToggleAvailability = (pizzaId) => {
    const updatedPizzas =
      togglePizzaAvailability(pizzaId);

    setPizzas(updatedPizzas);
  };

  return (
    <div className="admin-pizza-menu">

      {/* Header */}
      <div className="pizza-menu-header">

        <div>
          <h2>Pizza Menu</h2>

          <p>
            Manage your PizzaFly menu items
          </p>
        </div>

        <button
          className="add-pizza-btn"
          onClick={handleAddPizza}
        >
          + Add Pizza
        </button>

      </div>


      {/* Add / Edit Form */}
      {showForm && (
        <div className="pizza-form-card">

          <div className="form-header">

            <div>
              <h3>
                {editingPizza
                  ? "Edit Pizza"
                  : "Add New Pizza"}
              </h3>

              <p>
                {editingPizza
                  ? "Update pizza information"
                  : "Create a new menu item"}
              </p>
            </div>

            <button
              className="close-form-btn"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* Pizza Name */}
              <div className="form-group">

                <label>
                  Pizza Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Chicken BBQ"
                  required
                />

              </div>


              {/* Price */}
              <div className="form-group">

                <label>
                  Price (৳)
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="499"
                  min="1"
                  required
                />

              </div>


              {/* Category */}
              <div className="form-group">

                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Chicken">
                    Chicken
                  </option>

                  <option value="Beef">
                    Beef
                  </option>

                  <option value="Cheese">
                    Cheese
                  </option>

                  <option value="Spicy">
                    Spicy
                  </option>

                  <option value="Vegetarian">
                    Vegetarian
                  </option>
                </select>

              </div>


              {/* Emoji */}
              <div className="form-group">

                <label>
                  Fallback Icon
                </label>

                <input
                  type="text"
                  name="emoji"
                  value={formData.emoji}
                  onChange={handleChange}
                  placeholder="🍕"
                />

              </div>

            </div>


            {/* Image Upload */}
            <div className="form-group image-upload-group">

              <label>
                Pizza Image
              </label>

              <div className="image-upload-area">

                {formData.image ? (
                  <div className="image-preview">

                    <img
                      src={formData.image}
                      alt="Pizza Preview"
                    />

                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          image: "",
                        }))
                      }
                    >
                      ✕ Remove
                    </button>

                  </div>
                ) : (
                  <label className="upload-box">

                    <span className="upload-icon">
                      📷
                    </span>

                    <strong>
                      Upload Pizza Image
                    </strong>

                    <small>
                      PNG, JPG or WEBP · Max 2MB
                    </small>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />

                  </label>
                )}

              </div>

            </div>


            {/* Description */}
            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Smoky chicken, BBQ sauce & mozzarella"
                rows="3"
              />

            </div>


            {/* Buttons */}
            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-pizza-btn"
              >
                {editingPizza
                  ? "Update Pizza"
                  : "Add Pizza"}
              </button>

            </div>

          </form>

        </div>
      )}


      {/* Pizza List */}
      <div className="pizza-admin-grid">

        {pizzas.length === 0 ? (

          <div className="empty-pizza">

            <div>
              🍕
            </div>

            <h3>
              No Pizza Found
            </h3>

            <p>
              Add your first pizza to the menu.
            </p>

            <button
              onClick={handleAddPizza}
            >
              + Add Pizza
            </button>

          </div>

        ) : (

          pizzas.map((pizza) => (

            <div
              className={`admin-pizza-card ${
                !pizza.available
                  ? "unavailable"
                  : ""
              }`}
              key={pizza.id}
            >

              {/* Pizza Image */}
              <div className="admin-pizza-image">

                {pizza.image ? (
                  <img
                    src={pizza.image}
                    alt={pizza.name}
                  />
                ) : (
                  <span>
                    {pizza.emoji || "🍕"}
                  </span>
                )}

              </div>


              {/* Information */}
              <div className="admin-pizza-info">

                <div className="pizza-card-top">

                  <span className="pizza-category">
                    {pizza.category}
                  </span>

                  <span
                    className={
                      pizza.available
                        ? "available-badge"
                        : "unavailable-badge"
                    }
                  >
                    {pizza.available
                      ? "Available"
                      : "Unavailable"}
                  </span>

                </div>


                <h3>
                  {pizza.name}
                </h3>


                <p>
                  {pizza.description}
                </p>


                <div className="pizza-card-bottom">

                  <strong>
                    ৳
                    {Number(
                      pizza.price
                    ).toLocaleString()}
                  </strong>

                </div>


                {/* Actions */}
                <div className="pizza-actions">

                  <button
                    className="edit-pizza-btn"
                    onClick={() =>
                      handleEditPizza(pizza)
                    }
                  >
                    ✏️ Edit
                  </button>


                  <button
                    className="availability-btn"
                    onClick={() =>
                      handleToggleAvailability(
                        pizza.id
                      )
                    }
                  >
                    {pizza.available
                      ? "⏸ Disable"
                      : "▶ Enable"}
                  </button>


                  <button
                    className="delete-pizza-btn"
                    onClick={() =>
                      handleDelete(pizza.id)
                    }
                  >
                    🗑️
                  </button>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default AdminPizzaMenu;