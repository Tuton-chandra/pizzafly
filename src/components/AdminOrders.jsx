
import { useEffect, useState } from "react";
import "./AdminOrders.css";

import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
} from "../utils/orderStorage.js";

function AdminOrders() {

  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");


  // Load orders
  useEffect(() => {

    const savedOrders = getOrders();

    setOrders(savedOrders);

  }, []);


  // Change status
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

  };


  // Delete order
  const handleDelete = (orderId) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this order?"
      );

    if (!confirmDelete) return;

    const updatedOrders =
      deleteOrder(orderId);

    setOrders(updatedOrders);

  };


  // Search + Filter
  const filteredOrders =
    orders.filter((order) => {

      const searchText =
        search.toLowerCase();

      const matchesSearch =
        order.id
          ?.toLowerCase()
          .includes(searchText) ||

        order.name
          ?.toLowerCase()
          .includes(searchText) ||

        order.phone
          ?.toLowerCase()
          .includes(searchText);


      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;


      return (
        matchesSearch &&
        matchesStatus
      );

    });


  return (

    <div className="orders-page">


      {/* Header */}

      <div className="orders-header">

        <div>

          <span className="orders-label">
            ORDER MANAGEMENT
          </span>

          <h1>
            Orders
          </h1>

          <p>
            Manage and monitor all
            PizzaFly customer orders.
          </p>

        </div>


        <div className="orders-count">

          <strong>
            {orders.length}
          </strong>

          <span>
            Total Orders
          </span>

        </div>

      </div>


      {/* Statistics */}

      <div className="order-stats">


        <div className="order-stat">

          <span>📦</span>

          <div>

            <small>
              Total
            </small>

            <strong>
              {orders.length}
            </strong>

          </div>

        </div>


        <div className="order-stat">

          <span>⏳</span>

          <div>

            <small>
              Pending
            </small>

            <strong>

              {
                orders.filter(
                  (order) =>
                    order.status ===
                    "Pending"
                ).length
              }

            </strong>

          </div>

        </div>


        <div className="order-stat">

          <span>👨‍🍳</span>

          <div>

            <small>
              Preparing
            </small>

            <strong>

              {
                orders.filter(
                  (order) =>
                    order.status ===
                    "Preparing"
                ).length
              }

            </strong>

          </div>

        </div>


        <div className="order-stat">

          <span>🚁</span>

          <div>

            <small>
              Delivering
            </small>

            <strong>

              {
                orders.filter(
                  (order) =>
                    order.status ===
                    "Out for Delivery"
                ).length
              }

            </strong>

          </div>

        </div>


        <div className="order-stat">

          <span>✅</span>

          <div>

            <small>
              Delivered
            </small>

            <strong>

              {
                orders.filter(
                  (order) =>
                    order.status ===
                    "Delivered"
                ).length
              }

            </strong>

          </div>

        </div>

      </div>


      {/* Toolbar */}

      <div className="orders-toolbar">


        <div className="orders-search">

          🔍

          <input
            type="text"
            placeholder="Search by order ID, customer or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >

          <option value="All">
            All Orders
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Confirmed">
            Confirmed
          </option>

          <option value="Preparing">
            Preparing
          </option>

          <option value="Out for Delivery">
            Out for Delivery
          </option>

          <option value="Delivered">
            Delivered
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>


        <button
          className="refresh-btn"
          onClick={() =>
            setOrders(getOrders())
          }
        >
          🔄 Refresh
        </button>

      </div>


      {/* Orders Table */}

      <div className="orders-table-card">

        <div className="table-title">

          <div>

            <h2>
              All Orders
            </h2>

            <p>
              Showing{" "}
              {filteredOrders.length}{" "}
              of {orders.length} orders
            </p>

          </div>

        </div>


        <div className="orders-table-wrapper">

          <table className="orders-table">

            <thead>

              <tr>

                <th>
                  Order ID
                </th>

                <th>
                  Customer
                </th>

                <th>
                  Items
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Payment
                </th>

                <th>
                  Date
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

              {filteredOrders.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="no-orders"
                  >

                    <div>

                      <span>
                        🍕
                      </span>

                      <strong>
                        No orders found
                      </strong>

                      <p>
                        Try changing your
                        search or filter.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredOrders.map(
                  (order) => (

                    <tr key={order.id}>


                      {/* Order ID */}

                      <td>

                        <strong className="order-id">
                          {order.id}
                        </strong>

                      </td>


                      {/* Customer */}

                      <td>

                        <div className="customer-info">

                          <div className="customer-avatar">
                            {order.name
                              ?.charAt(0)
                              .toUpperCase() ||
                              "C"}
                          </div>

                          <div>

                            <strong>
                              {order.name ||
                                "Customer"}
                            </strong>

                            <small>
                              {order.phone ||
                                "No phone"}
                            </small>

                          </div>

                        </div>

                      </td>


                      {/* Items */}

                      <td>

                        <div className="order-items">

                          {order.items?.map(
                            (item) => (

                              <span
                                key={item.id}
                              >

                                {item.name}

                                <b>
                                  ×{item.qty}
                                </b>

                              </span>

                            )
                          )}

                        </div>

                      </td>


                      {/* Amount */}

                      <td>

                        <strong>
                          ৳
                          {Number(
                            order.total || 0
                          ).toLocaleString()}
                        </strong>

                      </td>


                      {/* Payment */}

                      <td>

                        <span
                          className={
                            order.payment ===
                            "Paid"
                              ? "payment-badge paid"
                              : "payment-badge pending"
                          }
                        >

                          {order.payment ||
                            "Pending"}

                        </span>

                      </td>


                      {/* Date */}

                      <td>

                        <span className="order-date">

                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleDateString(
                                "en-BD",
                                {
                                  day: "2-digit",
                                  month:
                                    "short",
                                  year:
                                    "numeric",
                                }
                              )
                            : "—"}

                        </span>

                      </td>


                      {/* Status */}

                      <td>

                        <select
                          className={`status-select ${order.status
                            ?.toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            )}`}
                          value={
                            order.status ||
                            "Pending"
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value
                            )
                          }
                        >

                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Confirmed">
                            Confirmed
                          </option>

                          <option value="Preparing">
                            Preparing
                          </option>

                          <option value="Out for Delivery">
                            Out for Delivery
                          </option>

                          <option value="Delivered">
                            Delivered
                          </option>

                          <option value="Cancelled">
                            Cancelled
                          </option>

                        </select>

                      </td>


                      {/* Action */}

                      <td>

                        <button
                          className="delete-order-btn"
                          onClick={() =>
                            handleDelete(
                              order.id
                            )
                          }
                          title="Delete Order"
                        >

                          🗑️

                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

export default AdminOrders;

