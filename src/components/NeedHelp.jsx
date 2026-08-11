import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getSupportMessages,
  updateSupportMessage,
  deleteSupportMessage,
  subscribeToSupportMessages,
} from "../utils/supportStorage";

import "./NeedHelp.css";


function NeedHelp() {
  const [messages, setMessages] = useState([]);

  const [selectedId, setSelectedId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");


  /* ------------------------------------------------
     Initial load + LIVE listener
  ------------------------------------------------ */

  useEffect(() => {
    // Initial messages
    setMessages(
      getSupportMessages()
    );


    // Live updates
    const unsubscribe =
      subscribeToSupportMessages(
        (updatedMessages) => {
          setMessages(updatedMessages);
        }
      );


    // Cleanup
    return () => {
      unsubscribe();
    };
  }, []);


  /* ------------------------------------------------
     Selected message
  ------------------------------------------------ */

  const selectedMessage = useMemo(() => {
    return messages.find(
      (message) =>
        message.id === selectedId
    );
  }, [messages, selectedId]);


  /* ------------------------------------------------
     Search + Filter
  ------------------------------------------------ */

  const filteredMessages =
    useMemo(() => {
      const searchText =
        search.trim().toLowerCase();

      return messages.filter(
        (message) => {
          const matchesSearch =
            !searchText ||
            message.id
              ?.toLowerCase()
              .includes(searchText) ||
            message.name
              ?.toLowerCase()
              .includes(searchText) ||
            message.email
              ?.toLowerCase()
              .includes(searchText) ||
            message.phone
              ?.toLowerCase()
              .includes(searchText) ||
            message.subject
              ?.toLowerCase()
              .includes(searchText) ||
            message.message
              ?.toLowerCase()
              .includes(searchText);


          const matchesStatus =
            statusFilter === "All" ||
            message.status ===
              statusFilter;


          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      messages,
      search,
      statusFilter,
    ]);


  /* ------------------------------------------------
     Statistics
  ------------------------------------------------ */

  const total =
    messages.length;

  const pending =
    messages.filter(
      (message) =>
        message.status ===
        "Pending"
    ).length;

  const inProgress =
    messages.filter(
      (message) =>
        message.status ===
        "In Progress"
    ).length;

  const resolved =
    messages.filter(
      (message) =>
        message.status ===
        "Resolved"
    ).length;


  /* ------------------------------------------------
     Change Status
  ------------------------------------------------ */

  const handleStatusChange = (
    id,
    status
  ) => {
    const updated =
      updateSupportMessage(
        id,
        {
          status,
        }
      );

    setMessages(updated);
  };


  /* ------------------------------------------------
     Delete
  ------------------------------------------------ */

  const handleDelete = (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this support request?"
      );

    if (!confirmed) {
      return;
    }

    const updated =
      deleteSupportMessage(id);

    setMessages(updated);

    if (selectedId === id) {
      setSelectedId(null);
    }
  };


  /* ------------------------------------------------
     Format Date
  ------------------------------------------------ */

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(
      date
    ).toLocaleString(
      "en-BD",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };


  return (
    <div className="support-page">

      {/* HEADER */}

      <div className="support-header">

        <div>
          <span className="support-label">
            CUSTOMER SUPPORT
          </span>

          <h1>
            Need Help
          </h1>

          <p>
            Manage customer questions,
            support requests and
            communication.
          </p>
        </div>


        <div className="support-live-status">

          <span className="live-dot"></span>

          Live Support

        </div>

      </div>


      {/* CHANNELS */}

      <div className="support-channels">

        <a
          href="tel:+8801XXXXXXXXX"
          className="support-channel call"
        >
          <span>📞</span>

          <div>
            <strong>
              Call Support
            </strong>

            <small>
              +880 1XXXXXXXXX
            </small>
          </div>
        </a>


        <a
          href="https://wa.me/8801XXXXXXXXX"
          target="_blank"
          rel="noreferrer"
          className="support-channel whatsapp"
        >
          <span>💬</span>

          <div>
            <strong>
              WhatsApp
            </strong>

            <small>
              Open WhatsApp
            </small>
          </div>
        </a>


        <a
          href="https://m.me/"
          target="_blank"
          rel="noreferrer"
          className="support-channel messenger"
        >
          <span>💙</span>

          <div>
            <strong>
              Messenger
            </strong>

            <small>
              Open Messenger
            </small>
          </div>
        </a>

      </div>


      {/* STATISTICS */}

      <div className="support-stats">

        <div className="support-stat">
          <span className="support-stat-icon">
            💬
          </span>

          <div>
            <small>
              Total Requests
            </small>

            <strong>
              {total}
            </strong>
          </div>
        </div>


        <div className="support-stat">
          <span className="support-stat-icon pending">
            ⏳
          </span>

          <div>
            <small>
              Pending
            </small>

            <strong>
              {pending}
            </strong>
          </div>
        </div>


        <div className="support-stat">
          <span className="support-stat-icon active">
            🔄
          </span>

          <div>
            <small>
              In Progress
            </small>

            <strong>
              {inProgress}
            </strong>
          </div>
        </div>


        <div className="support-stat">
          <span className="support-stat-icon resolved">
            ✓
          </span>

          <div>
            <small>
              Resolved
            </small>

            <strong>
              {resolved}
            </strong>
          </div>
        </div>

      </div>


      {/* TOOLBAR */}

      <div className="support-toolbar">

        <div className="support-search">

          🔍

          <input
            type="text"
            placeholder="Search customer, email, phone or message..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
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
            All Requests
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Resolved">
            Resolved
          </option>
        </select>

      </div>


      {/* MAIN CONTENT */}

      <div className="support-content">


        {/* REQUEST LIST */}

        <div className="support-list-card">

          <div className="support-list-header">

            <div>
              <h2>
                Customer Requests
              </h2>

              <p>
                {filteredMessages.length}
                {" "}requests found
              </p>
            </div>

            <span className="request-live-badge">
              ● LIVE
            </span>

          </div>


          <div className="support-request-list">

            {filteredMessages.length ===
            0 ? (

              <div className="support-empty">

                <span>
                  💬
                </span>

                <strong>
                  No support requests
                </strong>

                <p>
                  Customer messages will
                  appear here automatically.
                </p>

              </div>

            ) : (

              filteredMessages.map(
                (message) => (

                  <button
                    key={message.id}
                    className={`support-request ${
                      selectedId ===
                      message.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedId(
                        message.id
                      )
                    }
                  >

                    <div className="request-avatar">
                      {message.name
                        ?.charAt(0)
                        .toUpperCase() ||
                        "C"}
                    </div>


                    <div className="request-main">

                      <div className="request-top">

                        <strong>
                          {message.name}
                        </strong>

                        <span>
                          {formatDate(
                            message.createdAt
                          )}
                        </span>

                      </div>


                      <small>
                        {message.subject}
                      </small>


                      <p>
                        {message.message}
                      </p>


                      <div className="request-meta">

                        <span
                          className={`request-status ${
                            message.status
                              ?.toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )
                          }`}
                        >
                          {message.status}
                        </span>


                        <span className="request-source">
                          {message.channel}
                        </span>

                      </div>

                    </div>

                  </button>

                )
              )

            )}

          </div>

        </div>


        {/* DETAIL */}

        <div className="support-detail-card">

          {!selectedMessage ? (

            <div className="support-detail-empty">

              <span>
                📩
              </span>

              <h3>
                Select a customer request
              </h3>

              <p>
                Choose a message from the
                list to view customer
                details and manage the
                request.
              </p>

            </div>

          ) : (

            <>

              <div className="detail-header">

                <div>

                  <span>
                    SUPPORT REQUEST
                  </span>

                  <h2>
                    {selectedMessage.subject}
                  </h2>

                  <small>
                    {selectedMessage.id}
                    {" • "}
                    {formatDate(
                      selectedMessage.createdAt
                    )}
                  </small>

                </div>


                <button
                  className="detail-delete"
                  onClick={() =>
                    handleDelete(
                      selectedMessage.id
                    )
                  }
                  title="Delete request"
                >
                  🗑️
                </button>

              </div>


              {/* CUSTOMER */}

              <div className="detail-customer">

                <div className="detail-avatar">
                  {selectedMessage.name
                    ?.charAt(0)
                    .toUpperCase() ||
                    "C"}
                </div>

                <div>

                  <strong>
                    {selectedMessage.name}
                  </strong>

                  <small>
                    {selectedMessage.email ||
                      "No email provided"}
                  </small>

                </div>

              </div>


              {/* MESSAGE */}

              <div className="detail-section">

                <label>
                  CUSTOMER MESSAGE
                </label>

                <div className="customer-message">
                  {selectedMessage.message}
                </div>

              </div>


              {/* INFO */}

              <div className="detail-info-grid">

                <div>
                  <small>
                    Phone
                  </small>

                  <strong>
                    {selectedMessage.phone ||
                      "Not provided"}
                  </strong>
                </div>


                <div>
                  <small>
                    Email
                  </small>

                  <strong>
                    {selectedMessage.email ||
                      "Not provided"}
                  </strong>
                </div>


                <div>
                  <small>
                    Channel
                  </small>

                  <strong>
                    {selectedMessage.channel}
                  </strong>
                </div>


                <div>
                  <small>
                    Received
                  </small>

                  <strong>
                    {formatDate(
                      selectedMessage.createdAt
                    )}
                  </strong>
                </div>

              </div>


              {/* STATUS */}

              <div className="detail-section">

                <label>
                  REQUEST STATUS
                </label>

                <select
                  className="detail-status-select"
                  value={
                    selectedMessage.status ||
                    "Pending"
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      selectedMessage.id,
                      e.target.value
                    )
                  }
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>

                </select>

              </div>


              {/* ACTIONS */}

              <div className="customer-actions">

                {selectedMessage.phone && (
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="call-action"
                  >
                    📞 Call
                  </a>
                )}


                {selectedMessage.phone && (
                  <a
                    href={`https://wa.me/${selectedMessage.phone.replace(
                      /\D/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="whatsapp-action"
                  >
                    💬 WhatsApp
                  </a>
                )}


                {selectedMessage.email && (
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="messenger-action"
                  >
                    ✉️ Email
                  </a>
                )}

              </div>

            </>

          )}

        </div>

      </div>

    </div>
  );
}

export default NeedHelp;