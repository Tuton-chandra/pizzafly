import { useState, useRef, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { addOrder } from "./utils/orderStorage.js";
import "./App.css";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Features from "./components/Features.jsx";
import PizzaMenu from "./components/PizzaMenu.jsx";
import Cart from "./components/Cart.jsx";
import Checkout from "./components/Checkout.jsx";
import Tracking from "./components/Tracking.jsx";
import LoginModal from "./components/LoginModal.jsx";
import About from "./components/About.jsx";
import Footer from "./components/Footer.jsx";

import AdminDashboard from "./components/AdminDashboard.jsx";
import AdminLogin from "./components/AdminLogin.jsx";


// =====================================================
//  CUSTOMER WEBSITE
// =====================================================

function CustomerWebsite() {
  // ---------------------------------------------------
  // CART STATE
  // ---------------------------------------------------

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ---------------------------------------------------
  // MODAL / FLOW STATE
  // ---------------------------------------------------

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [order, setOrder] = useState(null);

  const [deliveryAddress, setDeliveryAddress] =
    useState("Dhaka, Bangladesh");

  // ---------------------------------------------------
  // SECTION REFS
  // ---------------------------------------------------

  const menuRef = useRef(null);
  const trackingRef = useRef(null);
  const howItWorksRef = useRef(null);
  const aboutRef = useRef(null);

  // ---------------------------------------------------
  // SMOOTH SCROLL
  // ---------------------------------------------------

  const scrollTo = useCallback((ref) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  // ===================================================
  // CART OPERATIONS
  // ===================================================

  const addToCart = (pizza) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.id === pizza.id
      );

      if (existing) {
        return prev.map((item) =>
          item.id === pizza.id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...pizza,
          qty: 1,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: item.qty + 1,
            }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty: item.qty - 1,
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // ===================================================
  // CART CALCULATIONS
  // ===================================================

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + item.qty * Number(item.price || 0),
    0
  );

  const deliveryFee =
    cartItems.length > 0 ? 50 : 0;

  const total = subtotal + deliveryFee;

  // ===================================================
  // CHECKOUT
  // ===================================================

  const openCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }

    setOrder(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // ===================================================
  // PLACE ORDER
  // ===================================================

  const placeOrder = (formData) => {
    const orderId = `PF-2026-${Date.now()}`;

    const newOrder = {
      id: orderId,

      name: formData.name || "",

      phone: formData.phone || "",

      address:
        formData.address ||
        deliveryAddress,

      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),

      subtotal,

      deliveryFee,

      total,

      payment:
        formData.payment ||
        "Cash on Delivery",

      status: "Pending",

      eta: 10,

      createdAt:
        new Date().toISOString(),
    };

    // Save order
    addOrder(newOrder);

    // Keep tracking flow working
    setOrder({
      ...newOrder,
      status: "confirmed",
    });

    // Update address
    setDeliveryAddress(
      formData.address ||
        deliveryAddress
    );

    // Empty cart
    setCartItems([]);

    console.log(
      "PizzaFly Order Created:",
      newOrder
    );
  };

  // ===================================================
  // TRACK ORDER
  // ===================================================

  const trackOrder = () => {
    setIsCheckoutOpen(false);

    setTimeout(() => {
      scrollTo(trackingRef);
    }, 100);
  };

  // ===================================================
  // CUSTOMER UI
  // ===================================================

  return (
    <div className="pizza-fly-app">

      {/* NAVBAR */}

      <Navbar
        cartCount={cartCount}
        onCartClick={() =>
          setIsCartOpen(true)
        }
        onLoginClick={() =>
          setIsLoginOpen(true)
        }
        onOrderClick={() =>
          scrollTo(menuRef)
        }
        onNavigate={{
          menu: () =>
            scrollTo(menuRef),

          tracking: () =>
            scrollTo(trackingRef),

          how: () =>
            scrollTo(howItWorksRef),

          about: () =>
            scrollTo(aboutRef),
        }}
      />

      <main>

        {/* HERO */}

        <Hero
          onOrderClick={() =>
            scrollTo(menuRef)
          }
          onTrackClick={() =>
            scrollTo(trackingRef)
          }
        />

        {/* HOW IT WORKS */}

        <section
          ref={howItWorksRef}
        >
          <HowItWorks />
        </section>

        {/* FEATURES */}

        <Features />

        {/* PIZZA MENU */}

        <section ref={menuRef}>
          <PizzaMenu
            onAddToCart={addToCart}
          />
        </section>

        {/* TRACKING */}

        <section ref={trackingRef}>
          <Tracking
            order={order}
            address={deliveryAddress}
            onAddressChange={
              setDeliveryAddress
            }
          />
        </section>

        {/* ABOUT */}

        <section ref={aboutRef}>
          <About />
        </section>

      </main>

      {/* FOOTER */}

      <Footer
        onNavigate={{
          menu: () =>
            scrollTo(menuRef),

          tracking: () =>
            scrollTo(trackingRef),

          how: () =>
            scrollTo(howItWorksRef),

          about: () =>
            scrollTo(aboutRef),
        }}
      />

      {/* CART */}

      <Cart
        isOpen={isCartOpen}
        onClose={() =>
          setIsCartOpen(false)
        }
        items={cartItems}
        onIncrease={increaseQty}
        onDecrease={decreaseQty}
        onRemove={removeItem}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
        onCheckout={openCheckout}
      />

      {/* CHECKOUT */}

      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() =>
          setIsCheckoutOpen(false)
        }
        total={total}
        order={order}
        onPlaceOrder={placeOrder}
        onTrackOrder={trackOrder}
        defaultAddress={deliveryAddress}
      />

      {/* LOGIN */}

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() =>
          setIsLoginOpen(false)
        }
      />

    </div>
  );
}


// =====================================================
// MAIN APP / ROUTER
// =====================================================

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] =
    useState(
      sessionStorage.getItem(
        "pizzafly_admin"
      ) === "true"
    );

  // ---------------------------------------------------
  // ADMIN LOGIN
  // ---------------------------------------------------

  const handleAdminLogin = () => {
    sessionStorage.setItem(
      "pizzafly_admin",
      "true"
    );

    setIsAdminLoggedIn(true);
  };

  // ---------------------------------------------------
  // ADMIN LOGOUT
  // ---------------------------------------------------

  const handleAdminLogout = () => {
    sessionStorage.removeItem(
      "pizzafly_admin"
    );

    setIsAdminLoggedIn(false);
  };

  // ---------------------------------------------------
  // ROUTES
  // ---------------------------------------------------

  return (
    <BrowserRouter>
      <Routes>

        {/* CUSTOMER WEBSITE */}

        <Route
          path="/"
          element={
            <CustomerWebsite />
          }
        />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            isAdminLoggedIn ? (
              <AdminDashboard
                onLogout={
                  handleAdminLogout
                }
              />
            ) : (
              <AdminLogin
                onLogin={
                  handleAdminLogin
                }
              />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  );
}


export default App;