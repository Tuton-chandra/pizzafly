import { useEffect, useState } from "react";
import "./AdminDashboard.css";

import AdminOrders from "./AdminOrders.jsx";
import AdminPizzaMenu from "./AdminPizzaMenu.jsx";
import AdminCustomers from "./AdminCustomers.jsx";
import AdminDrones from "./AdminDrones.jsx";
import AdminLiveTracking from "./AdminLiveTracking.jsx";
import AdminPayments from "./AdminPayments.jsx";

import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
} from "../utils/orderStorage.js";

function AdminDashboard({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [orders, setOrders] = useState([]);

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  useEffect(() => {
    const loadOrders = () => {
      setOrders(getOrders());
    };

    loadOrders();

    window.addEventListener("ordersUpdated", loadOrders);

    return () => {
      window.removeEventListener(
        "ordersUpdated",
        loadOrders
      );
    };
  }, []);

  // =====================================================
  // ORDER STATUS
  // =====================================================

  const handleStatusChange = (
    orderId,
    newStatus
  ) => {
    const updatedOrders =
      updateOrderStatus(
        orderId,
        newStatus
      );

    setOrders(updatedOrders);

    window.dispatchEvent(
      new Event("ordersUpdated")
    );
  };

  // =====================================================
  // DELETE ORDER
  // =====================================================

  const handleDeleteOrder = (orderId) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this order?"
      );

    if (!confirmDelete) return;

    const updatedOrders =
      deleteOrder(orderId);

    setOrders(updatedOrders);

    window.dispatchEvent(
      new Event("ordersUpdated")
    );
  };

  // =====================================================
  // DASHBOARD STATS
  // =====================================================

  const totalOrders = orders.length;

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const todayOrders = orders.filter(
    (order) =>
      order.createdAt?.startsWith(today)
  ).length;

  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum + Number(order.total || 0),
    0
  );

  const deliveredOrders = orders.filter(
    (order) =>
      order.status === "Delivered"
  ).length;

  const preparingOrders = orders.filter(
    (order) =>
      order.status === "Preparing"
  ).length;

  const outForDeliveryOrders =
    orders.filter(
      (order) =>
        order.status ===
        "Out for Delivery"
    ).length;

  // =====================================================
  // STATS
  // =====================================================

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      change: "Live",
      icon: "🛒",
    },
    {
      title: "Today's Orders",
      value: todayOrders.toLocaleString(),
      change: "Today",
      icon: "🍕",
    },
    {
      title: "Total Revenue",
      value: `৳${totalRevenue.toLocaleString()}`,
      change: "Live",
      icon: "💰",
    },
    {
      title: "Delivered",
      value: deliveredOrders.toLocaleString(),
      change: "Completed",
      icon: "✅",
    },
  ];

  // =====================================================
  // SIDEBAR MENU
  // =====================================================

  const menuItems = [
    "Dashboard",
    "Orders",
    "Pizza Menu",
    "Customers",
    "Drones",
    "Live Tracking",
    "Payments",
    "Reports",
    "Settings",
  ];

  const menuIcons = [
    "📊",
    "🛒",
    "🍕",
    "👥",
    "🚁",
    "📍",
    "💳",
    "📈",
    "⚙️",
  ];

  // =====================================================
  // RENDER ACTIVE PAGE
  // =====================================================

  const renderContent = () => {
  switch (activeMenu) {

    case "Orders":
      return (
        <AdminOrders
          orders={orders}
          onStatusChange={handleStatusChange}
          onDeleteOrder={handleDeleteOrder}
        />
      );

    case "Pizza Menu":
      return <AdminPizzaMenu />;

    case "Customers":
      return <AdminCustomers />;

    case "Drones":
      return <AdminDrones />;

    case "Live Tracking":
      return <AdminLiveTracking />;

    case "Payments":
      return <AdminPayments />

    case "Reports":
      return (
        <div className="dashboard-placeholder">
          <div className="placeholder-icon">
            📈
          </div>

          <h2>Reports</h2>

          <p>
            Reports and analytics will be
            available here.
          </p>
        </div>
      );

    case "Settings":
      return (
        <div className="dashboard-placeholder">
          <div className="placeholder-icon">
            ⚙️
          </div>

          <h2>Settings</h2>

          <p>
            Admin settings will be
            available here.
          </p>
        </div>
      );

      default:
        return (
          <>
            {/* =========================================
                STATS
            ========================================= */}

            <section className="stats-grid">

              {stats.map((stat) => (
                <div
                  className="stat-card"
                  key={stat.title}
                >
                  <div className="stat-top">

                    <div className="stat-icon">
                      {stat.icon}
                    </div>

                    <span className="stat-change">
                      {stat.change}
                    </span>

                  </div>

                  <p>
                    {stat.title}
                  </p>

                  <h2>
                    {stat.value}
                  </h2>

                </div>
              ))}

            </section>


            {/* =========================================
                DELIVERY OVERVIEW
            ========================================= */}

            <section className="dashboard-grid">

              <div className="dashboard-card delivery-overview">

                <div className="card-header">

                  <div>
                    <h2>
                      Delivery Status
                    </h2>

                    <p>
                      Current order delivery
                      overview
                    </p>
                  </div>

                </div>


                <div className="delivery-circle">

                  <div>
                    <strong>
                      {orders.length}
                    </strong>

                    <span>
                      Orders
                    </span>
                  </div>

                </div>


                <div className="delivery-stats">

                  <div>
                    <span className="dot delivered"></span>

                    <span>
                      Delivered
                    </span>

                    <strong>
                      {deliveredOrders}
                    </strong>
                  </div>


                  <div>
                    <span className="dot flight"></span>

                    <span>
                      In Flight
                    </span>

                    <strong>
                      {outForDeliveryOrders}
                    </strong>
                  </div>


                  <div>
                    <span className="dot preparing"></span>

                    <span>
                      Preparing
                    </span>

                    <strong>
                      {preparingOrders}
                    </strong>
                  </div>

                </div>

              </div>


              {/* Quick Summary */}

              <div className="dashboard-card">

                <div className="card-header">

                  <div>
                    <h2>
                      PizzaFly Overview
                    </h2>

                    <p>
                      Current system summary
                    </p>
                  </div>

                </div>


                <div className="overview-list">

                  <div className="overview-item">
                    <span>
                      🛒 Total Orders
                    </span>

                    <strong>
                      {totalOrders}
                    </strong>
                  </div>


                  <div className="overview-item">
                    <span>
                      🍕 Today's Orders
                    </span>

                    <strong>
                      {todayOrders}
                    </strong>
                  </div>


                  <div className="overview-item">
                    <span>
                      💰 Revenue
                    </span>

                    <strong>
                      ৳{totalRevenue.toLocaleString()}
                    </strong>
                  </div>


                  <div className="overview-item">
                    <span>
                      🚁 Active Delivery
                    </span>

                    <strong>
                      {outForDeliveryOrders}
                    </strong>
                  </div>

                </div>

              </div>

            </section>


            {/* =========================================
                RECENT ORDERS
            ========================================= */}

            <section className="dashboard-card orders-card">

              <div className="card-header">

                <div>
                  <h2>
                    Recent Orders
                  </h2>

                  <p>
                    Latest PizzaFly orders
                  </p>
                </div>


                <button
                  className="view-all"
                  onClick={() =>
                    setActiveMenu("Orders")
                  }
                >
                  View All →
                </button>

              </div>


              <div className="table-wrapper">

                <table>

                  <thead>
                    <tr>

                      <th>
                        Order ID
                      </th>

                      <th>
                        Customer
                      </th>

                      <th>
                        Pizza
                      </th>

                      <th>
                        Amount
                      </th>

                      <th>
                        Payment
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Action
                      </th>

                    </tr>
                  </thead>


                  <tbody>

                    {orders.length === 0 ? (

                      <tr>

                        <td
                          colSpan="7"
                          style={{
                            textAlign:
                              "center",
                            padding:
                              "40px",
                          }}
                        >
                          🍕 No orders yet.
                          <br />
                          Customer orders
                          will appear here.
                        </td>

                      </tr>

                    ) : (

                      orders
                        .slice(0, 5)
                        .map((order) => (

                          <tr
                            key={order.id}
                          >

                            <td>
                              <strong>
                                {order.id}
                              </strong>
                            </td>


                            <td>
                              {order.name ||
                                "Unknown"}
                            </td>


                            <td>

                              {order.items?.map(
                                (item) => (
                                  <div
                                    key={item.id}
                                  >
                                    {item.name}
                                    {" × "}
                                    {item.qty}
                                  </div>
                                )
                              )}

                            </td>


                            <td>
                              <strong>
                                ৳
                                {Number(
                                  order.total ||
                                    0
                                ).toLocaleString()}
                              </strong>
                            </td>


                            <td>
                              {order.payment ||
                                "Pending"}
                            </td>


                            <td>

                              <span
                                className={`status-badge ${(
                                  order.status ||
                                  "Pending"
                                )
                                  .toLowerCase()
                                  .replace(
                                    /\s+/g,
                                    "-"
                                  )}`}
                              >
                                {order.status ||
                                  "Pending"}
                              </span>

                            </td>


                            <td>

                              <button
                                className="action-btn"
                                onClick={() =>
                                  handleDeleteOrder(
                                    order.id
                                  )
                                }
                                title="Delete Order"
                              >
                                🗑️
                              </button>

                            </td>

                          </tr>

                        ))

                    )}

                  </tbody>

                </table>

              </div>

            </section>


            {/* =========================================
                QUICK ACTIONS
            ========================================= */}

            <section className="dashboard-card quick-actions">

              <div className="card-header">

                <div>
                  <h2>
                    Quick Actions
                  </h2>

                  <p>
                    Manage PizzaFly quickly
                  </p>
                </div>

              </div>


              <div className="quick-grid">

                <button
                  onClick={() =>
                    setActiveMenu(
                      "Pizza Menu"
                    )
                  }
                >
                  <span>🍕</span>
                  Pizza Menu
                </button>


                <button
                  onClick={() =>
                    setActiveMenu(
                      "Orders"
                    )
                  }
                >
                  <span>🛒</span>
                  Orders
                </button>


                <button
                  onClick={() =>
                    setActiveMenu(
                      "Customers"
                    )
                  }
                >
                  <span>👥</span>
                  Customers
                </button>


                <button
                  onClick={() =>
                    setActiveMenu(
                      "Drones"
                    )
                  }
                >
                  <span>🚁</span>
                  Drones
                </button>

              </div>

            </section>
          </>
        );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="admin-layout">

      {/* ===============================================
          SIDEBAR
      =============================================== */}

      <aside className="admin-sidebar">

        <div className="admin-logo">

          <span>🍕</span>

          <strong>
            Pizza<span>Fly</span>
          </strong>

        </div>


        <div className="admin-label">
          ADMIN PANEL
        </div>


        <nav className="admin-nav">

          {menuItems.map(
            (item, index) => (

              <button
                key={item}
                className={
                  activeMenu === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveMenu(item)
                }
              >

                <span className="nav-icon">
                  {menuIcons[index]}
                </span>

                <span>
                  {item}
                </span>

              </button>

            )
          )}

        </nav>


        {/* Sidebar Bottom */}

        <div className="sidebar-bottom">

          <div className="admin-support">

            <span>💡</span>

            <div>
              <strong>
                Need Help?
              </strong>

              <small>
                Contact support
              </small>
            </div>

          </div>


          <button
            className="logout-btn"
            onClick={onLogout}
          >
            🚪 Logout
          </button>

        </div>

      </aside>


      {/* ===============================================
          MAIN
      =============================================== */}

      <main className="admin-main">

        {/* TOPBAR */}

        <header className="admin-topbar">

          <div className="admin-page-title">

            <h1>
              {activeMenu}
            </h1>

            <p>
              Welcome back, Admin.
              Here's what's happening today.
            </p>

          </div>


          <div className="admin-top-actions">

            <div className="admin-search">

              🔍

              <input
                type="text"
                placeholder="Search..."
              />

            </div>


            <button className="notification-btn">
              🔔
              <span></span>
            </button>


            <div className="admin-profile">

              <div className="profile-avatar">
                A
              </div>

              <div>

                <strong>
                  Admin
                </strong>

                <small>
                  Administrator
                </small>

              </div>

              <span>
                ⌄
              </span>

            </div>

          </div>

        </header>


        {/* CONTENT */}

        <div className="admin-content">
          {renderContent()}
        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;