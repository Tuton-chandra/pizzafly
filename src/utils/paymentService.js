import {
  getOrders,
  updateOrderPayment,
} from "./orderStorage.js";

// =====================================================
// PAYMENT METHODS
// =====================================================

export const PAYMENT_METHODS = {
  COD: "Cash on Delivery",
  BKASH: "bKash",
  NAGAD: "Nagad",
  ROCKET: "Rocket",
  UPAY: "Upay",
  SSLCOMMERZ: "SSLCommerz",
};

// =====================================================
// PAYMENT STATUSES
// =====================================================

export const PAYMENT_STATUSES = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

// =====================================================
// SEARCH PAYMENTS
// Order ID
// Customer
// Phone
// Transaction ID
// Payment Method
// Payment Status
// =====================================================

export const searchPayments = (searchText = "") => {
  const orders = getOrders();

  const search = String(searchText)
    .trim()
    .toLowerCase();

  if (!search) {
    return orders;
  }

  return orders.filter((order) => {
    const orderId = String(
      order.id || ""
    ).toLowerCase();

    const customerName = String(
      order.name || ""
    ).toLowerCase();

    const phone = String(
      order.phone || ""
    ).toLowerCase();

    const transactionId = String(
      order.transactionId || ""
    ).toLowerCase();

    const paymentMethod = String(
      order.paymentMethod ||
        order.payment ||
        ""
    ).toLowerCase();

    const paymentStatus = String(
      order.paymentStatus || ""
    ).toLowerCase();

    return (
      orderId.includes(search) ||
      customerName.includes(search) ||
      phone.includes(search) ||
      transactionId.includes(search) ||
      paymentMethod.includes(search) ||
      paymentStatus.includes(search)
    );
  });
};

// =====================================================
// UPDATE PAYMENT
// =====================================================

export const updatePayment = (
  orderId,
  paymentData = {}
) => {
  const orders = getOrders();

  // ===================================================
  // CHECK ORDER
  // ===================================================

  const orderExists = orders.some(
    (order) =>
      String(order.id) ===
      String(orderId)
  );

  if (!orderExists) {
    return {
      success: false,
      message: "Order not found.",
    };
  }

  // ===================================================
  // PAYMENT METHOD
  // ===================================================

  const paymentMethod =
    paymentData.paymentMethod ||
    PAYMENT_METHODS.COD;

  // ===================================================
  // PAYMENT STATUS
  // ===================================================

  const paymentStatus =
    paymentData.paymentStatus ||
    PAYMENT_STATUSES.PENDING;

  // ===================================================
  // TRANSACTION ID
  // ===================================================

  const transactionId = String(
    paymentData.transactionId ?? ""
  ).trim();

  // ===================================================
  // PAYMENT DATE
  //
  // Paid = current date/time
  // Pending = null
  // Failed = null
  // Refunded = null
  //
  // IMPORTANT:
  // Paid → Pending করলে পুরোনো date থাকবে না।
  // ===================================================

  const paymentDate =
    paymentStatus ===
    PAYMENT_STATUSES.PAID
      ? new Date().toISOString()
      : null;

  // ===================================================
  // UPDATE ORDER
  // ===================================================

  const updatedOrders =
    updateOrderPayment(
      orderId,
      {
        paymentMethod,
        paymentStatus,
        transactionId,
        paymentDate,
      }
    );

  // ===================================================
  // FIND UPDATED ORDER
  // ===================================================

  const updatedOrder =
    updatedOrders.find(
      (order) =>
        String(order.id) ===
        String(orderId)
    );

  // ===================================================
  // EVENTS
  // ===================================================

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new Event("ordersUpdated")
    );

    window.dispatchEvent(
      new Event("paymentUpdated")
    );
  }

  // ===================================================
  // RESPONSE
  // ===================================================

  return {
    success: true,
    message:
      "Payment updated successfully.",
    data: updatedOrder,
  };
};

// =====================================================
// VERIFY PAYMENT
// =====================================================
//
// Local/demo verification.
//
// Transaction ID selected order-এর সাথে match
// করলে verification successful হবে.
//
// Future:
// bKash API
// Nagad API
// Rocket API
// Upay API
// SSLCommerz API
// এখানে connect করা যাবে.
// =====================================================

export const verifyPayment = (
  orderId,
  transactionId,
  paymentMethod
) => {
  const orders = getOrders();

  const cleanOrderId = String(
    orderId || ""
  ).trim();

  const cleanTransactionId =
    String(transactionId || "")
      .trim()
      .toLowerCase();

  // ===================================================
  // ORDER ID CHECK
  // ===================================================

  if (!cleanOrderId) {
    return {
      success: false,
      verified: false,
      message:
        "Order ID is required.",
    };
  }

  // ===================================================
  // TRANSACTION ID CHECK
  // ===================================================

  if (!cleanTransactionId) {
    return {
      success: false,
      verified: false,
      message:
        "Transaction ID is required.",
    };
  }

  // ===================================================
  // FIND ORDER
  // ===================================================

  const order = orders.find(
    (item) =>
      String(item.id) ===
      cleanOrderId
  );

  if (!order) {
    return {
      success: false,
      verified: false,
      message:
        "Order not found.",
    };
  }

  // ===================================================
  // SAVED TRANSACTION ID
  // ===================================================

  const savedTransactionId =
    String(
      order.transactionId || ""
    )
      .trim()
      .toLowerCase();

  // ===================================================
  // TRANSACTION MATCH
  // ===================================================

  if (
    !savedTransactionId ||
    savedTransactionId !==
      cleanTransactionId
  ) {
    return {
      success: false,
      verified: false,
      message:
        "Transaction ID does not match this order.",
    };
  }

  // ===================================================
  // SAVED PAYMENT METHOD
  // ===================================================

  const savedMethod =
    order.paymentMethod ||
    order.payment ||
    PAYMENT_METHODS.COD;

  // ===================================================
  // PAYMENT METHOD CHECK
  // ===================================================

  if (
    paymentMethod &&
    savedMethod !== paymentMethod
  ) {
    return {
      success: false,
      verified: false,
      message:
        "Payment method does not match this order.",
    };
  }

  // ===================================================
  // ALREADY PAID
  // ===================================================

  if (
    order.paymentStatus ===
    PAYMENT_STATUSES.PAID
  ) {
    return {
      success: true,
      verified: true,
      message:
        "Payment is already verified.",
      orderId: order.id,
      transactionId:
        order.transactionId || "",
      paymentMethod: savedMethod,
      paymentStatus:
        order.paymentStatus,
    };
  }

  // ===================================================
  // LOCAL DEMO VERIFICATION
  // ===================================================

  return {
    success: true,
    verified: true,
    message:
      "Transaction ID matched successfully. Payment can be marked as Paid.",
    orderId: order.id,
    transactionId:
      order.transactionId || "",
    paymentMethod: savedMethod,
    paymentStatus:
      order.paymentStatus ||
      PAYMENT_STATUSES.PENDING,
  };
};

// =====================================================
// FIND PAYMENT BY TRANSACTION ID
// =====================================================

export const findPaymentByTransactionId = (
  transactionId
) => {
  const orders = getOrders();

  const searchId = String(
    transactionId || ""
  )
    .trim()
    .toLowerCase();

  if (!searchId) {
    return null;
  }

  return (
    orders.find(
      (order) =>
        String(
          order.transactionId || ""
        )
          .trim()
          .toLowerCase() === searchId
    ) || null
  );
};