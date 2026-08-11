const PAYMENTS_KEY = "pizzafly_payments";

// =====================================================
// GET ALL PAYMENTS
// =====================================================

export const getPayments = () => {
  try {
    const payments = localStorage.getItem(PAYMENTS_KEY);

    return payments ? JSON.parse(payments) : [];
  } catch (error) {
    console.error("Failed to load payments:", error);
    return [];
  }
};

// =====================================================
// SAVE PAYMENTS
// =====================================================

export const savePayments = (payments) => {
  try {
    localStorage.setItem(
      PAYMENTS_KEY,
      JSON.stringify(payments)
    );

    return true;
  } catch (error) {
    console.error("Failed to save payments:", error);
    return false;
  }
};

// =====================================================
// ADD PAYMENT
// =====================================================

export const addPayment = (payment) => {
  const payments = getPayments();

  const newPayment = {
    id:
      payment.id ||
      `PAY-${Date.now()}`,

    orderId:
      payment.orderId || "",

    customerName:
      payment.customerName || "",

    phone:
      payment.phone || "",

    amount:
      Number(payment.amount || 0),

    method:
      payment.method || "Cash",

    provider:
      payment.provider || "",

    transactionId:
      payment.transactionId || "",

    status:
      payment.status || "Pending",

    gateway:
      payment.gateway || "Manual",

    createdAt:
      payment.createdAt ||
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),
  };

  const updatedPayments = [
    newPayment,
    ...payments,
  ];

  savePayments(updatedPayments);

  window.dispatchEvent(
    new Event("paymentsUpdated")
  );

  return newPayment;
};

// =====================================================
// UPDATE PAYMENT
// =====================================================

export const updatePayment = (
  paymentId,
  updatedData
) => {
  const payments = getPayments();

  const updatedPayments = payments.map(
    (payment) =>
      payment.id === paymentId
        ? {
            ...payment,
            ...updatedData,
            amount:
              updatedData.amount !== undefined
                ? Number(updatedData.amount)
                : payment.amount,
            updatedAt:
              new Date().toISOString(),
          }
        : payment
  );

  savePayments(updatedPayments);

  window.dispatchEvent(
    new Event("paymentsUpdated")
  );

  return updatedPayments;
};

// =====================================================
// UPDATE PAYMENT STATUS
// =====================================================

export const updatePaymentStatus = (
  paymentId,
  status
) => {
  return updatePayment(
    paymentId,
    { status }
  );
};

// =====================================================
// DELETE PAYMENT
// =====================================================

export const deletePayment = (
  paymentId
) => {
  const payments = getPayments();

  const updatedPayments =
    payments.filter(
      (payment) =>
        payment.id !== paymentId
    );

  savePayments(updatedPayments);

  window.dispatchEvent(
    new Event("paymentsUpdated")
  );

  return updatedPayments;
};

// =====================================================
// SEARCH PAYMENT
// =====================================================

export const searchPayments = (
  query
) => {
  const payments = getPayments();

  const searchQuery =
    String(query || "")
      .trim()
      .toLowerCase();

  if (!searchQuery) {
    return payments;
  }

  return payments.filter(
    (payment) =>
      String(payment.id || "")
        .toLowerCase()
        .includes(searchQuery) ||

      String(payment.orderId || "")
        .toLowerCase()
        .includes(searchQuery) ||

      String(payment.customerName || "")
        .toLowerCase()
        .includes(searchQuery) ||

      String(payment.phone || "")
        .toLowerCase()
        .includes(searchQuery) ||

      String(payment.transactionId || "")
        .toLowerCase()
        .includes(searchQuery) ||

      String(payment.provider || "")
        .toLowerCase()
        .includes(searchQuery)
  );
};

// =====================================================
// GET PAYMENT BY TRANSACTION ID
// =====================================================

export const getPaymentByTransactionId = (
  transactionId
) => {
  const payments = getPayments();

  return payments.find(
    (payment) =>
      String(
        payment.transactionId || ""
      )
        .toLowerCase() ===
      String(transactionId || "")
        .trim()
        .toLowerCase()
  );
};

// =====================================================
// CLEAR ALL PAYMENTS
// =====================================================

export const clearPayments = () => {
  localStorage.removeItem(
    PAYMENTS_KEY
  );

  window.dispatchEvent(
    new Event("paymentsUpdated")
  );
};