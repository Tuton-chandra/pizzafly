import {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./AdminPayments.css";

import {
  getOrders,
} from "../utils/orderStorage.js";

import {
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  searchPayments,
  updatePayment,
  verifyPayment,
} from "../utils/paymentService.js";

function AdminPayments() {
  // =====================================================
  // STATE
  // =====================================================

  const [orders, setOrders] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [
    editingPayment,
    setEditingPayment,
  ] = useState(null);

  const [
    verifyResult,
    setVerifyResult,
  ] = useState(null);

  const [
    paymentForm,
    setPaymentForm,
  ] = useState({
    paymentMethod:
      PAYMENT_METHODS.COD,

    paymentStatus:
      PAYMENT_STATUSES.PENDING,

    transactionId: "",
  });

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  useEffect(() => {
    const loadOrders = () => {
      setOrders(
        getOrders()
      );
    };

    loadOrders();

    window.addEventListener(
      "ordersUpdated",
      loadOrders
    );

    window.addEventListener(
      "paymentUpdated",
      loadOrders
    );

    return () => {
      window.removeEventListener(
        "ordersUpdated",
        loadOrders
      );

      window.removeEventListener(
        "paymentUpdated",
        loadOrders
      );
    };
  }, []);

  // =====================================================
  // PAYMENT SUMMARY
  // =====================================================

  const totalPayments =
    orders.length;

  const paidPayments =
    orders.filter(
      (order) =>
        order.paymentStatus ===
        PAYMENT_STATUSES.PAID
    ).length;

  const pendingPayments =
    orders.filter(
      (order) =>
        !order.paymentStatus ||
        order.paymentStatus ===
          PAYMENT_STATUSES.PENDING
    ).length;

  const failedPayments =
    orders.filter(
      (order) =>
        order.paymentStatus ===
        PAYMENT_STATUSES.FAILED
    ).length;

  const refundedPayments =
    orders.filter(
      (order) =>
        order.paymentStatus ===
        PAYMENT_STATUSES.REFUNDED
    ).length;

  const totalPaidAmount =
    orders
      .filter(
        (order) =>
          order.paymentStatus ===
          PAYMENT_STATUSES.PAID
      )
      .reduce(
        (sum, order) =>
          sum +
          Number(
            order.total || 0
          ),
        0
      );

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredOrders =
    useMemo(() => {
      const result =
        searchPayments(search);

      /*
       * searchPayments localStorage থেকে
       * fresh orders নিয়ে কাজ করে।
       *
       * তাই orders dependency রাখা হয়েছে
       * যেন update হওয়ার পর component
       * re-render করে।
       */

      return result;
    }, [search, orders]);

  // =====================================================
  // EDIT PAYMENT
  // =====================================================

  const handleEditPayment = (
    order
  ) => {
    setEditingPayment(order);

    setVerifyResult(null);

    setPaymentForm({
      paymentMethod:
        order.paymentMethod ||
        order.payment ||
        PAYMENT_METHODS.COD,

      paymentStatus:
        order.paymentStatus ||
        PAYMENT_STATUSES.PENDING,

      transactionId:
        order.transactionId ||
        "",
    });
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handlePaymentChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setPaymentForm(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );

    setVerifyResult(null);
  };

  // =====================================================
  // SAVE PAYMENT
  // =====================================================

  const handleSavePayment = (
    e
  ) => {
    e.preventDefault();

    if (!editingPayment) {
      return;
    }

    const result =
      updatePayment(
        editingPayment.id,
        {
          paymentMethod:
            paymentForm.paymentMethod,

          paymentStatus:
            paymentForm.paymentStatus,

          transactionId:
            paymentForm.transactionId.trim(),
        }
      );

    // ================================================
    // UPDATE FAILED
    // ================================================

    if (
      !result ||
      !result.success
    ) {
      alert(
        result?.message ||
          "Failed to update payment."
      );

      return;
    }

    // ================================================
    // GET FRESH DATA
    // ================================================

    const freshOrders =
      getOrders();

    setOrders(
      freshOrders
    );

    // ================================================
    // CLOSE FORM
    // ================================================

    setEditingPayment(null);

    setVerifyResult(null);

    resetPaymentForm();
  };

  // =====================================================
  // VERIFY TRANSACTION
  // =====================================================

  const handleVerifyTransaction =
    () => {
      if (!editingPayment) {
        return;
      }

      const transactionId =
        paymentForm.transactionId.trim();

      // ================================================
      // TRANSACTION ID REQUIRED
      // ================================================

      if (!transactionId) {
        alert(
          "Please enter a Transaction ID first."
        );

        return;
      }

      // ================================================
      // VERIFY
      // ================================================

      const result =
        verifyPayment(
          editingPayment.id,
          transactionId,
          paymentForm.paymentMethod
        );

      setVerifyResult(
        result
      );

      // ================================================
      // VERIFIED
      // ================================================

      if (
        result.success &&
        result.verified
      ) {
        setPaymentForm(
          (prev) => ({
            ...prev,

            paymentStatus:
              PAYMENT_STATUSES.PAID,
          })
        );

        /*
         * এখানে সরাসরি localStorage update করছি না।
         *
         * Admin Save Payment চাপলে
         * updatePayment() database/localStorage
         * update করবে।
         */
      }
    };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetPaymentForm =
    () => {
      setPaymentForm({
        paymentMethod:
          PAYMENT_METHODS.COD,

        paymentStatus:
          PAYMENT_STATUSES.PENDING,

        transactionId: "",
      });
    };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancelEdit =
    () => {
      setEditingPayment(null);

      setVerifyResult(null);

      resetPaymentForm();
    };

  // =====================================================
  // PAYMENT METHOD
  // =====================================================

  const getPaymentMethod =
    (order) => {
      return (
        order.paymentMethod ||
        order.payment ||
        PAYMENT_METHODS.COD
      );
    };

  // =====================================================
  // PAYMENT STATUS
  // =====================================================

  const getPaymentStatus =
    (order) => {
      return (
        order.paymentStatus ||
        PAYMENT_STATUSES.PENDING
      );
    };

  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "—";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-GB"
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="admin-payments">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="payments-header">
        <div>
          <h2>
            Payments
          </h2>

          <p>
            Manage MFS, SSLCommerz and
            customer transactions
          </p>
        </div>
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="payment-stats">

        <div className="payment-stat-card">
          <span className="payment-stat-icon">
            💳
          </span>

          <div>
            <strong>
              {totalPayments}
            </strong>

            <small>
              Total Payments
            </small>
          </div>
        </div>

        <div className="payment-stat-card">
          <span className="payment-stat-icon">
            ✅
          </span>

          <div>
            <strong>
              {paidPayments}
            </strong>

            <small>
              Paid
            </small>
          </div>
        </div>

        <div className="payment-stat-card">
          <span className="payment-stat-icon">
            ⏳
          </span>

          <div>
            <strong>
              {pendingPayments}
            </strong>

            <small>
              Pending
            </small>
          </div>
        </div>

        <div className="payment-stat-card">
          <span className="payment-stat-icon">
            ❌
          </span>

          <div>
            <strong>
              {failedPayments}
            </strong>

            <small>
              Failed
            </small>
          </div>
        </div>

        <div className="payment-stat-card">
          <span className="payment-stat-icon">
            💰
          </span>

          <div>
            <strong>
              ৳
              {totalPaidAmount.toLocaleString()}
            </strong>

            <small>
              Paid Amount
            </small>
          </div>
        </div>

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="payments-toolbar">

        <div className="payment-search">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search Order ID, customer, phone or Transaction ID..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* =================================================
          EDIT PAYMENT
      ================================================= */}

      {editingPayment && (

        <div className="payment-form-card">

          <div className="payment-form-header">

            <div>

              <h3>
                Update Payment
              </h3>

              <p>
                Order:{" "}
                <strong>
                  {editingPayment.id}
                </strong>
              </p>

            </div>

            <button
              type="button"
              className="close-payment-form"
              onClick={
                handleCancelEdit
              }
            >
              ✕
            </button>

          </div>

          <form
            onSubmit={
              handleSavePayment
            }
          >

            <div className="payment-form-grid">

              {/* PAYMENT METHOD */}

              <div className="payment-form-group">

                <label>
                  Payment Method
                </label>

                <select
                  name="paymentMethod"
                  value={
                    paymentForm.paymentMethod
                  }
                  onChange={
                    handlePaymentChange
                  }
                >

                  <option
                    value={
                      PAYMENT_METHODS.COD
                    }
                  >
                    Cash on Delivery
                  </option>

                  <option
                    value={
                      PAYMENT_METHODS.BKASH
                    }
                  >
                    bKash
                  </option>

                  <option
                    value={
                      PAYMENT_METHODS.NAGAD
                    }
                  >
                    Nagad
                  </option>

                  <option
                    value={
                      PAYMENT_METHODS.ROCKET
                    }
                  >
                    Rocket
                  </option>

                  <option
                    value={
                      PAYMENT_METHODS.UPAY
                    }
                  >
                    Upay
                  </option>

                  <option
                    value={
                      PAYMENT_METHODS.SSLCOMMERZ
                    }
                  >
                    SSLCommerz
                  </option>

                </select>

              </div>

              {/* PAYMENT STATUS */}

              <div className="payment-form-group">

                <label>
                  Payment Status
                </label>

                <select
                  name="paymentStatus"
                  value={
                    paymentForm.paymentStatus
                  }
                  onChange={
                    handlePaymentChange
                  }
                >

                  <option
                    value={
                      PAYMENT_STATUSES.PENDING
                    }
                  >
                    Pending
                  </option>

                  <option
                    value={
                      PAYMENT_STATUSES.PAID
                    }
                  >
                    Paid
                  </option>

                  <option
                    value={
                      PAYMENT_STATUSES.FAILED
                    }
                  >
                    Failed
                  </option>

                  <option
                    value={
                      PAYMENT_STATUSES.REFUNDED
                    }
                  >
                    Refunded
                  </option>

                </select>

              </div>

              {/* TRANSACTION ID */}

              <div className="payment-form-group">

                <label>
                  Transaction ID
                </label>

                <input
                  type="text"
                  name="transactionId"
                  value={
                    paymentForm.transactionId
                  }
                  onChange={
                    handlePaymentChange
                  }
                  placeholder="Enter Transaction ID"
                />

              </div>

            </div>

            {/* =================================================
                VERIFY RESULT
            ================================================= */}

            {verifyResult && (

              <div
                className={`payment-verify-result ${
                  verifyResult.success &&
                  verifyResult.verified
                    ? "verified"
                    : "not-verified"
                }`}
              >

                <strong>
                  {verifyResult.success &&
                  verifyResult.verified
                    ? "✅ Payment Verified"
                    : "⚠️ Payment Not Verified"}
                </strong>

                <span>
                  {verifyResult.message}
                </span>

                {verifyResult.success &&
                  verifyResult.verified && (

                    <small>
                      Order:{" "}
                      {verifyResult.orderId}

                      {" • "}

                      Transaction:{" "}
                      {
                        verifyResult.transactionId
                      }

                      {" • "}

                      Method:{" "}
                      {
                        verifyResult.paymentMethod
                      }
                    </small>

                  )}

              </div>

            )}

            {/* =================================================
                FORM ACTIONS
            ================================================= */}

            <div className="payment-form-actions">

              <button
                type="button"
                className="payment-verify-btn"
                onClick={
                  handleVerifyTransaction
                }
              >
                🔎 Verify Transaction
              </button>

              <button
                type="button"
                className="payment-cancel-btn"
                onClick={
                  handleCancelEdit
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="payment-save-btn"
              >
                💾 Save Payment
              </button>

            </div>

          </form>

        </div>
      )}

      {/* =================================================
          PAYMENT TABLE
      ================================================= */}

      <div className="payments-card">

        <div className="payments-table-wrapper">

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
                  Amount
                </th>

                <th>
                  Payment Method
                </th>

                <th>
                  Transaction ID
                </th>

                <th>
                  Status
                </th>

                <th>
                  Date
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
                    className="payments-empty"
                  >

                    <div>
                      💳
                    </div>

                    <strong>
                      No Payments Found
                    </strong>

                    <p>
                      No payment records
                      match your search.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredOrders.map(
                  (order) => {

                    const paymentMethod =
                      getPaymentMethod(
                        order
                      );

                    const paymentStatus =
                      getPaymentStatus(
                        order
                      );

                    return (

                      <tr
                        key={order.id}
                      >

                        {/* ORDER */}

                        <td>
                          <strong>
                            {order.id}
                          </strong>
                        </td>

                        {/* CUSTOMER */}

                        <td>

                          <div className="payment-customer">

                            <strong>
                              {order.name ||
                                "Unknown"}
                            </strong>

                            <small>
                              {order.phone ||
                                "No phone"}
                            </small>

                          </div>

                        </td>

                        {/* AMOUNT */}

                        <td>

                          <strong>
                            ৳
                            {Number(
                              order.total ||
                                0
                            ).toLocaleString()}
                          </strong>

                        </td>

                        {/* METHOD */}

                        <td>

                          <div className="payment-method">

                            <strong>
                              {
                                paymentMethod
                              }
                            </strong>

                            <small>

                              {paymentMethod ===
                              PAYMENT_METHODS.SSLCOMMERZ
                                ? "Online Gateway"
                                : paymentMethod ===
                                  PAYMENT_METHODS.COD
                                ? "Cash"
                                : "MFS"}

                            </small>

                          </div>

                        </td>

                        {/* TRANSACTION */}

                        <td>

                          <span className="transaction-id">

                            {order.transactionId ||
                              "Not Available"}

                          </span>

                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`payment-status-select ${paymentStatus
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}`}
                          >
                            {
                              paymentStatus
                            }
                          </span>

                        </td>

                        {/* DATE */}

                        <td>

                          {formatDate(
                            order.paymentDate
                          )}

                        </td>

                        {/* ACTION */}

                        <td>

                          <button
                            type="button"
                            className="payment-delete-btn"
                            onClick={() =>
                              handleEditPayment(
                                order
                              )
                            }
                            title="Update Payment"
                          >
                            ✏️
                          </button>

                        </td>

                      </tr>

                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =================================================
          REFUNDED INFO
      ================================================= */}

      {refundedPayments > 0 && (

        <div className="payment-refunded-info">

          ↩️{" "}
          {refundedPayments} payment
          {refundedPayments > 1
            ? "s"
            : ""}{" "}
          refunded.

        </div>

      )}

    </div>
  );
}

export default AdminPayments;