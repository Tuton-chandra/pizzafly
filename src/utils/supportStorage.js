const STORAGE_KEY = "pizzafly_support_messages";

const SUPPORT_EVENT = "pizzafly:support-updated";

/* -------------------------------------------------------
   Generate unique support ID
------------------------------------------------------- */

const generateId = () => {
  return `SUP-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;
};


/* -------------------------------------------------------
   Get all support messages
------------------------------------------------------- */

export const getSupportMessages = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(
      "Failed to load support messages:",
      error
    );

    return [];
  }
};


/* -------------------------------------------------------
   Save all messages
------------------------------------------------------- */

const saveSupportMessages = (messages) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(messages)
  );

  /*
   IMPORTANT:
   storage event does NOT fire in the same tab.

   So we create our own custom event for live
   communication inside the same browser tab.
  */

  window.dispatchEvent(
    new CustomEvent(SUPPORT_EVENT, {
      detail: messages,
    })
  );

  return messages;
};


/* -------------------------------------------------------
   Add new support message
------------------------------------------------------- */

export const addSupportMessage = (message) => {
  const messages = getSupportMessages();

  const newMessage = {
    id: generateId(),

    name: message.name?.trim() || "Customer",

    email: message.email?.trim() || "",

    phone: message.phone?.trim() || "",

    subject:
      message.subject?.trim() ||
      "General Inquiry",

    message:
      message.message?.trim() || "",

    channel:
      message.channel || "Website",

    status: "Pending",

    priority: "Normal",

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  };

  const updatedMessages = [
    newMessage,
    ...messages,
  ];

  saveSupportMessages(updatedMessages);

  return newMessage;
};


/* -------------------------------------------------------
   Update support message
------------------------------------------------------- */

export const updateSupportMessage = (
  messageId,
  updates
) => {
  const messages = getSupportMessages();

  const updatedMessages = messages.map(
    (message) => {
      if (message.id !== messageId) {
        return message;
      }

      return {
        ...message,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
  );

  saveSupportMessages(updatedMessages);

  return updatedMessages;
};


/* -------------------------------------------------------
   Delete support message
------------------------------------------------------- */

export const deleteSupportMessage = (
  messageId
) => {
  const messages = getSupportMessages();

  const updatedMessages = messages.filter(
    (message) =>
      message.id !== messageId
  );

  saveSupportMessages(updatedMessages);

  return updatedMessages;
};


/* -------------------------------------------------------
   Subscribe to live support updates
------------------------------------------------------- */

export const subscribeToSupportMessages = (
  callback
) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  /*
    Same-tab live update
  */

  const handleCustomEvent = (event) => {
    const messages =
      event.detail ||
      getSupportMessages();

    callback(messages);
  };


  /*
    Other-tab / other-window live update
  */

  const handleStorageEvent = (event) => {
    if (event.key !== STORAGE_KEY) {
      return;
    }

    callback(
      getSupportMessages()
    );
  };


  window.addEventListener(
    SUPPORT_EVENT,
    handleCustomEvent
  );

  window.addEventListener(
    "storage",
    handleStorageEvent
  );


  /*
    Cleanup function
  */

  return () => {
    window.removeEventListener(
      SUPPORT_EVENT,
      handleCustomEvent
    );

    window.removeEventListener(
      "storage",
      handleStorageEvent
    );
  };
};


/* -------------------------------------------------------
   Clear all messages
------------------------------------------------------- */

export const clearSupportMessages = () => {
  saveSupportMessages([]);

  return [];
};