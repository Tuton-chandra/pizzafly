import { useEffect, useMemo, useState } from "react";
import "./AdminReports.css";

import { getOrders } from "../utils/orderStorage.js";

function AdminReports() {
  const [orders, setOrders] = useState([]);
  const [period, setPeriod] = useState("all");

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
      window.removeEventListener("ordersUpdated", loadOrders);
    };
  }, []);

  // =====================================================
  // FILTER ORDERS
  // =====================================================

  const filteredOrders = useMemo(() => {
    if (period === "all") {
      return orders;
    }

    const now = new Date();

    return orders.filter((order) => {
      if (!order.createdAt) return false;

      const orderDate = new Date(order.createdAt);

      if (period === "today") {
        return (
          orderDate.toDateString() === now.toDateString()
        );
      }

      if (period === "7days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);

        return orderDate >= sevenDaysAgo;
      }

      if (period === "30days") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        return orderDate >= thirtyDaysAgo;
      }

      return true;
    });
  }, [orders, period]);

  // =====================================================
  // REPORT CALCULATIONS
  // =====================================================

  const totalOrders = filteredOrders.length;

  const totalRevenue = filteredOrders.reduce(
    (sum, order) =>
      sum + Number(order.total || 0),
    0
  );

  const deliveredOrders = filteredOrders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const preparingOrders = filteredOrders.filter(
    (order) => order.status === "Preparing"
  ).length;

  const outForDeliveryOrders = filteredOrders.filter(
    (order) =>
      order.status === "Out for Delivery"
  ).length;

  const pendingOrders = filteredOrders.filter(
    (order) =>
      !order.status ||
      order.status === "Pending"
  ).length;

  const averageOrderValue =
    totalOrders > 0
      ? totalRevenue / totalOrders
      : 0;

  // =====================================================
  // PAYMENT REPORT
  // =====================================================

  const paidOrders = filteredOrders.filter(
    (order) =>
      String(order.payment || "").toLowerCase() ===
      "paid"
  ).length;

  const pendingPayments = filteredOrders.filter(
    (order) =>
      String(order.payment || "").toLowerCase() ===
        "pending" ||
      !order.payment
  ).length;

  const paidRevenue = filteredOrders
    .filter(
      (order) =>
        String(order.payment || "").toLowerCase() ===
        "paid"
    )
    .reduce(
      (sum, order) =>
        sum + Number(order.total || 0),
      0
    );

  const pendingRevenue = filteredOrders
    .filter(
      (order) =>
        String(order.payment || "").toLowerCase() !==
        "paid"
    )
    .reduce(
      (sum, order) =>
        sum + Number(order.total || 0),
      0
    );

  // =====================================================
  // DELIVERY RATE
  // =====================================================

  const deliveryRate =
    totalOrders > 0
      ? Math.round(
          (deliveredOrders / totalOrders) * 100
        )
      : 0;

  // =====================================================
  // STATUS DATA
  // =====================================================

  const statusData = [
    {
      label: "Delivered",
      value: deliveredOrders,
      className: "report-green",
      icon: "✅",
    },
    {
      label: "Out for Delivery",
      value: outForDeliveryOrders,
      className: "report-orange",
      icon: "🚁",
    },
    {
      label: "Preparing",
      value: preparingOrders,
      className: "report-yellow",
      icon: "🍕",
    },
    {
      label: "Pending",
      value: pendingOrders,
      className: "report-gray",
      icon: "⏳",
    },
  ];

  // =====================================================
  // TOP PIZZAS
  // =====================================================

  const pizzaData = useMemo(() => {
    const pizzaMap = {};

    filteredOrders.forEach((order) => {
      order.items?.forEach((item) => {
        const name = item.name || "Unknown Pizza";
        const qty = Number(item.qty || 1);

        if (!pizzaMap[name]) {
          pizzaMap[name] = {
            name,
            quantity: 0,
            revenue: 0,
          };
        }

        pizzaMap[name].quantity += qty;

        pizzaMap[name].revenue +=
          Number(item.price || 0) * qty;
      });
    });

    return Object.values(pizzaMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [filteredOrders]);

  // =====================================================
  // RECENT REPORT ORDERS
  // =====================================================

  const recentOrders = [...filteredOrders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 6);

  // =====================================================
  // EXPORT REPORT
  // =====================================================

  const handleExport = () => {
    if (filteredOrders.length === 0) {
      alert("No report data available to export.");
      return;
    }

    const headers = [
      "Order ID",
      "Customer",
      "Phone",
      "Total",
      "Payment",
      "Status",
      "Date",
    ];

    const rows = filteredOrders.map((order) => [
      order.id || "",
      order.name || "",
      order.phone || "",
      order.total || 0,
      order.payment || "Pending",
      order.status || "Pending",
      order.createdAt
        ? new Date(
            order.createdAt
          ).toLocaleDateString("en-GB")
        : "",
    ]);

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(
              /"/g,
              '""'
            )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = `pizzafly-report-${new Date()
      .toISOString()
      .split("T")[0]}.csv`;

    link.click();

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="reports-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="reports-header">

        <div>
          <h2>Reports & Analytics</h2>

          <p>
            Monitor PizzaFly performance,
            revenue and order activity.
          </p>
        </div>

        <div className="reports-actions">

          <select
            value={period}
            onChange={(e) =>
              setPeriod(e.target.value)
            }
          >
            <option value="all">
              All Time
            </option>

            <option value="today">
              Today
            </option>

            <option value="7days">
              Last 7 Days
            </option>

            <option value="30days">
              Last 30 Days
            </option>
          </select>

          <button
            className="export-report-btn"
            onClick={handleExport}
          >
            📥 Export Report
          </button>

        </div>

      </div>

      {/* =================================================
          MAIN STAT CARDS
      ================================================= */}

      <section className="report-stats-grid">

        <div className="report-stat-card">

          <div className="report-stat-top">
            <div className="report-stat-icon orange">
              🛒
            </div>

            <span className="report-stat-label">
              Orders
            </span>
          </div>

          <p>Total Orders</p>

          <h3>
            {totalOrders.toLocaleString()}
          </h3>

          <small>
            Orders in selected period
          </small>

        </div>


        <div className="report-stat-card">

          <div className="report-stat-top">
            <div className="report-stat-icon green">
              💰
            </div>

            <span className="report-stat-label green-text">
              Revenue
            </span>
          </div>

          <p>Total Revenue</p>

          <h3>
            ৳{totalRevenue.toLocaleString()}
          </h3>

          <small>
            Gross order value
          </small>

        </div>


        <div className="report-stat-card">

          <div className="report-stat-top">
            <div className="report-stat-icon blue">
              📊
            </div>

            <span className="report-stat-label blue-text">
              Average
            </span>
          </div>

          <p>Average Order Value</p>

          <h3>
            ৳{Math.round(
              averageOrderValue
            ).toLocaleString()}
          </h3>

          <small>
            Average spending per order
          </small>

        </div>


        <div className="report-stat-card">

          <div className="report-stat-top">
            <div className="report-stat-icon purple">
              ✅
            </div>

            <span className="report-stat-label purple-text">
              Success
            </span>
          </div>

          <p>Delivery Rate</p>

          <h3>
            {deliveryRate}%
          </h3>

          <small>
            Successfully delivered
          </small>

        </div>

      </section>


      {/* =================================================
          REPORT GRID
      ================================================= */}

      <section className="reports-main-grid">

        {/* DELIVERY STATUS */}

        <div className="report-card">

          <div className="report-card-header">

            <div>
              <h3>Order Status</h3>

              <p>
                Current order distribution
              </p>
            </div>

          </div>

          <div className="status-report-list">

            {statusData.map((item) => {

              const percentage =
                totalOrders > 0
                  ? Math.round(
                      (item.value /
                        totalOrders) *
                        100
                    )
                  : 0;

              return (
                <div
                  className="status-report-item"
                  key={item.label}
                >

                  <div className="status-report-info">

                    <span>
                      {item.icon}
                    </span>

                    <strong>
                      {item.label}
                    </strong>

                    <b>
                      {item.value}
                    </b>

                  </div>

                  <div className="status-progress">

                    <span
                      className={
                        item.className
                      }
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                  <small>
                    {percentage}%
                  </small>

                </div>
              );
            })}

          </div>

        </div>


        {/* PAYMENT SUMMARY */}

        <div className="report-card">

          <div className="report-card-header">

            <div>
              <h3>Payment Summary</h3>

              <p>
                Payment performance
              </p>
            </div>

          </div>

          <div className="payment-summary">

            <div className="payment-summary-circle">

              <div>
                <strong>
                  {paidOrders}
                </strong>

                <span>
                  Paid Orders
                </span>
              </div>

            </div>


            <div className="payment-summary-list">

              <div>
                <span className="payment-dot paid-dot" />

                <span>
                  Paid
                </span>

                <strong>
                  ৳{paidRevenue.toLocaleString()}
                </strong>
              </div>


              <div>
                <span className="payment-dot pending-dot" />

                <span>
                  Pending
                </span>

                <strong>
                  ৳{pendingRevenue.toLocaleString()}
                </strong>
              </div>


              <div>
                <span>
                  📦
                </span>

                <span>
                  Total Orders
                </span>

                <strong>
                  {totalOrders}
                </strong>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          TOP SELLING PIZZAS
      ================================================= */}

      <section className="report-card pizza-report-card">

        <div className="report-card-header">

          <div>
            <h3>Top Selling Pizzas</h3>

            <p>
              Most ordered pizzas in selected period
            </p>
          </div>

        </div>


        {pizzaData.length === 0 ? (

          <div className="report-empty">
            🍕
            <strong>
              No pizza sales data
            </strong>
            <span>
              Pizza sales will appear here
              after customers place orders.
            </span>
          </div>

        ) : (

          <div className="pizza-report-list">

            {pizzaData.map(
              (pizza, index) => {

                const maxQuantity =
                  pizzaData[0]?.quantity || 1;

                const percentage =
                  (pizza.quantity /
                    maxQuantity) *
                  100;

                return (
                  <div
                    className="pizza-report-row"
                    key={pizza.name}
                  >

                    <div className="pizza-rank">
                      #{index + 1}
                    </div>

                    <div className="pizza-report-info">

                      <strong>
                        {pizza.name}
                      </strong>

                      <div className="pizza-progress">

                        <span
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>

                    <div className="pizza-quantity">

                      <strong>
                        {pizza.quantity}
                      </strong>

                      <small>
                        sold
                      </small>

                    </div>

                    <div className="pizza-revenue">

                      ৳
                      {pizza.revenue.toLocaleString()}

                    </div>

                  </div>
                );
              }
            )}

          </div>

        )}

      </section>


      {/* =================================================
          RECENT REPORT ORDERS
      ================================================= */}

      <section className="report-card recent-report-card">

        <div className="report-card-header">

          <div>
            <h3>Recent Orders</h3>

            <p>
              Latest orders included in this report
            </p>
          </div>

        </div>


        <div className="report-table-wrapper">

          <table className="report-table">

            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {recentOrders.length === 0 ? (

                <tr>
                  <td
                    colSpan="6"
                    className="report-table-empty"
                  >
                    No orders available.
                  </td>
                </tr>

              ) : (

                recentOrders.map(
                  (order) => (

                    <tr key={order.id}>

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
                        <strong>
                          ৳
                          {Number(
                            order.total || 0
                          ).toLocaleString()}
                        </strong>
                      </td>

                      <td>

                        <span
                          className={
                            String(
                              order.payment ||
                                "Pending"
                            ).toLowerCase() ===
                            "paid"
                              ? "report-badge paid"
                              : "report-badge pending"
                          }
                        >
                          {order.payment ||
                            "Pending"}
                        </span>

                      </td>

                      <td>

                        <span className="report-status">
                          {order.status ||
                            "Pending"}
                        </span>

                      </td>

                      <td>
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-GB"
                            )
                          : "—"}
                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </section>


      {/* =================================================
          REPORT FOOTER SUMMARY
      ================================================= */}

      <section className="report-footer-grid">

        <div className="report-mini-card">
          <span>💰</span>

          <div>
            <small>
              Paid Revenue
            </small>

            <strong>
              ৳{paidRevenue.toLocaleString()}
            </strong>
          </div>
        </div>


        <div className="report-mini-card">
          <span>⏳</span>

          <div>
            <small>
              Pending Payments
            </small>

            <strong>
              {pendingPayments}
            </strong>
          </div>
        </div>


        <div className="report-mini-card">
          <span>✅</span>

          <div>
            <small>
              Delivered Orders
            </small>

            <strong>
              {deliveredOrders}
            </strong>
          </div>
        </div>


        <div className="report-mini-card">
          <span>🚁</span>

          <div>
            <small>
              Active Delivery
            </small>

            <strong>
              {outForDeliveryOrders}
            </strong>
          </div>
        </div>

      </section>

    </div>
  );
}

export default AdminReports;