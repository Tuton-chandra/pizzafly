import { useEffect, useMemo, useState } from "react";
import "./AdminCustomers.css";

import { getOrders } from "../utils/orderStorage.js";

function AdminCustomers() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

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

  // Create customer list from orders
  const customers = useMemo(() => {
    const customerMap = {};

    orders.forEach((order) => {
      const phone = order.phone || "No Phone";

      if (!customerMap[phone]) {
        customerMap[phone] = {
          id: phone,
          name: order.name || "Unknown Customer",
          phone,
          address: order.address || "—",
          totalOrders: 0,
          totalSpent: 0,
          lastOrder: order.createdAt,
        };
      }

      customerMap[phone].totalOrders += 1;

      customerMap[phone].totalSpent += Number(
        order.total || 0
      );

      if (
        new Date(order.createdAt) >
        new Date(customerMap[phone].lastOrder)
      ) {
        customerMap[phone].lastOrder =
          order.createdAt;

        customerMap[phone].name =
          order.name || customerMap[phone].name;

        customerMap[phone].address =
          order.address ||
          customerMap[phone].address;
      }
    });

    return Object.values(customerMap);
  }, [orders]);

  // Search
  const filteredCustomers = customers.filter(
    (customer) => {
      const query = search.toLowerCase();

      return (
        customer.name
          .toLowerCase()
          .includes(query) ||
        customer.phone
          .toLowerCase()
          .includes(query) ||
        customer.address
          .toLowerCase()
          .includes(query)
      );
    }
  );

  const totalCustomers = customers.length;

  const totalSpent = customers.reduce(
    (sum, customer) =>
      sum + customer.totalSpent,
    0
  );

  return (
    <div className="customers-page">

      {/* Header */}
      <div className="customers-header">

        <div>
          <h2>Customers</h2>

          <p>
            Manage and view your PizzaFly customers
          </p>
        </div>

        <div className="customer-summary">

          <div>
            <strong>
              {totalCustomers}
            </strong>

            <span>
              Total Customers
            </span>
          </div>

          <div>
            <strong>
              ৳{totalSpent.toLocaleString()}
            </strong>

            <span>
              Customer Spending
            </span>
          </div>

        </div>

      </div>


      {/* Search */}
      <div className="customers-toolbar">

        <div className="customer-search">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search customer, phone or address..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>


      {/* Customer Table */}
      <div className="customers-card">

        <div className="customers-table-wrapper">

          <table>

            <thead>

              <tr>

                <th>Customer</th>

                <th>Phone</th>

                <th>Address</th>

                <th>Orders</th>

                <th>Total Spent</th>

                <th>Last Order</th>

              </tr>

            </thead>


            <tbody>

              {filteredCustomers.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="customers-empty"
                  >

                    <div>
                      👥
                    </div>

                    <strong>
                      No Customers Found
                    </strong>

                    <p>
                      Customers will appear here
                      after placing an order.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredCustomers.map(
                  (customer) => (

                    <tr key={customer.id}>

                      <td>

                        <div className="customer-info">

                          <div className="customer-avatar">
                            {customer.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <strong>
                              {customer.name}
                            </strong>

                            <small>
                              Customer
                            </small>

                          </div>

                        </div>

                      </td>


                      <td>
                        {customer.phone}
                      </td>


                      <td className="customer-address">
                        {customer.address}
                      </td>


                      <td>

                        <span className="orders-badge">
                          {customer.totalOrders}
                        </span>

                      </td>


                      <td>

                        <strong>
                          ৳
                          {customer.totalSpent.toLocaleString()}
                        </strong>

                      </td>


                      <td>

                        {customer.lastOrder
                          ? new Date(
                              customer.lastOrder
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

      </div>

    </div>
  );
}

export default AdminCustomers;