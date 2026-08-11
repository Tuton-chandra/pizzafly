const ORDERS_KEY = "pizzafly_orders";

// =====================================================
// GET ALL ORDERS
// =====================================================

export const getOrders = () => {
  try {
    const orders =
      localStorage.getItem(
        ORDERS_KEY
      );

    return orders
      ? JSON.parse(orders)
      : [];
  } catch (error) {
    console.error(
      "Failed to load orders:",
      error
    );

    return [];
  }
};

// =====================================================
// SAVE ALL ORDERS
// =====================================================

export const saveOrders = (orders) => {
  try {
    localStorage.setItem(
      ORDERS_KEY,
      JSON.stringify(orders)
    );

    return true;
  } catch (error) {
    console.error(
      "Failed to save orders:",
      error
    );

    return false;
  }
};

// =====================================================
// ADD NEW ORDER
// =====================================================

export const addOrder = (order) => {
  const orders = getOrders();

  const newOrder = {
    ...order,

    createdAt:
      order.createdAt ||
      new Date().toISOString(),

    status:
      order.status ||
      "Pending",

    // ===============================================
    // PAYMENT INFORMATION
    // ===============================================

    paymentMethod:
      order.paymentMethod ||
      order.payment ||
      "Cash on Delivery",

    paymentStatus:
      order.paymentStatus ||
      "Pending",

    transactionId:
      order.transactionId ||
      "",

    paymentDate:
      order.paymentDate ||
      null,
  };

  const updatedOrders = [
    newOrder,
    ...orders,
  ];

  saveOrders(updatedOrders);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new Event("ordersUpdated")
    );
  }

  return newOrder;
};

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

export const updateOrderStatus = (
  orderId,
  status
) => {
  const orders = getOrders();

  const updatedOrders =
    orders.map((order) =>
      String(order.id) ===
      String(orderId)
        ? {
            ...order,
            status,
          }
        : order
    );

  saveOrders(updatedOrders);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new Event("ordersUpdated")
    );
  }

  return updatedOrders;
};

// =====================================================
// UPDATE PAYMENT
// =====================================================

export const updateOrderPayment = (
  orderId,
  paymentData = {}
) => {
  const orders = getOrders();

  const updatedOrders =
    orders.map((order) => {

      // =============================================
      // ORDER ID CHECK
      // =============================================

      if (
        String(order.id) !==
        String(orderId)
      ) {
        return order;
      }

      // =============================================
      // PAYMENT METHOD
      // =============================================

      const paymentMethod =
        paymentData.paymentMethod !==
        undefined
          ? paymentData.paymentMethod
          : order.paymentMethod ||
            order.payment ||
            "Cash on Delivery";

      // =============================================
      // PAYMENT STATUS
      // =============================================

      const paymentStatus =
        paymentData.paymentStatus !==
        undefined
          ? paymentData.paymentStatus
          : order.paymentStatus ||
            "Pending";

      // =============================================
      // TRANSACTION ID
      // =============================================

      const transactionId =
        paymentData.transactionId !==
        undefined
          ? String(
              paymentData.transactionId
            ).trim()
          : String(
              order.transactionId || ""
            ).trim();

      // =============================================
      // PAYMENT DATE
      //
      // IMPORTANT:
      //
      // Paid:
      // নতুন payment date থাকবে
      //
      // Pending:
      // null
      //
      // Failed:
      // null
      //
      // Refunded:
      // null
      //
      // অর্থাৎ Paid → Pending করলে
      // আগের Paid date আর থাকবে না।
      // =============================================

      let paymentDate = null;

      if (
        paymentStatus === "Paid"
      ) {
        paymentDate =
          paymentData.paymentDate !==
          undefined
            ? paymentData.paymentDate
            : order.paymentDate ||
              new Date().toISOString();
      } else {
        paymentDate = null;
      }

      // =============================================
      // RETURN UPDATED ORDER
      // =============================================

      return {
        ...order,

        paymentMethod,

        paymentStatus,

        transactionId,

        paymentDate,
      };
    });

  // ===============================================
  // SAVE
  // ===============================================

  const saved =
    saveOrders(updatedOrders);

  if (!saved) {
    console.error(
      "Failed to save updated payment."
    );
  }

  // ===============================================
  // EVENT
  // ===============================================

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new Event("ordersUpdated")
    );
  }

  return updatedOrders;
};

// =====================================================
// DELETE ORDER
// =====================================================

export const deleteOrder = (
  orderId
) => {
  const orders = getOrders();

  const updatedOrders =
    orders.filter(
      (order) =>
        String(order.id) !==
        String(orderId)
    );

  saveOrders(updatedOrders);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new Event("ordersUpdated")
    );
  }

  return updatedOrders;
};

// =====================================================
// CLEAR ALL ORDERS
// =====================================================

export const clearOrders = () => {
  localStorage.removeItem(
    ORDERS_KEY
  );

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new Event("ordersUpdated")
    );
  }
};