import { useEffect, useState } from "react";
import "./AdminSettings.css";

function AdminSettings() {
  const [activeSection, setActiveSection] =
    useState("General");

  const [showRoleForm, setShowRoleForm] =
    useState(false);

  const [editingRoleId, setEditingRoleId] =
    useState(null);

  const [savedMessage, setSavedMessage] =
    useState("");

  // =====================================================
  // GENERAL SETTINGS
  // =====================================================

  const [generalSettings, setGeneralSettings] =
    useState({
      restaurantName: "PizzaFly",
      email: "admin@pizzafly.com",
      phone: "+880 1XXXXXXXXX",
      address: "Dhaka, Bangladesh",
      currency: "BDT",
      tax: "5",
      deliveryFee: "60",
      minOrder: "200",
    });

  // =====================================================
  // TOGGLE SETTINGS
  // =====================================================

  const [features, setFeatures] = useState({
    onlineOrders: true,
    cashOnDelivery: true,
    onlinePayment: true,
    droneDelivery: true,
    orderNotifications: true,
    emailNotifications: false,
    smsNotifications: true,
    maintenanceMode: false,
  });

  // =====================================================
  // ADMIN ROLES
  // =====================================================

  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Super Admin",
      description:
        "Full access to all restaurant operations",
      permissions:
        "All Permissions",
      users: 1,
      status: "Active",
      icon: "👑",
    },
    {
      id: 2,
      name: "Manager",
      description:
        "Manage orders, customers and reports",
      permissions:
        "Orders, Customers, Reports",
      users: 2,
      status: "Active",
      icon: "👨‍💼",
    },
    {
      id: 3,
      name: "Order Manager",
      description:
        "Handle customer orders and delivery",
      permissions:
        "Orders, Delivery",
      users: 3,
      status: "Active",
      icon: "🛒",
    },
    {
      id: 4,
      name: "Kitchen Staff",
      description:
        "Manage pizza preparation and kitchen",
      permissions:
        "Orders, Kitchen",
      users: 5,
      status: "Active",
      icon: "👨‍🍳",
    },
  ]);

  // =====================================================
  // ROLE FORM
  // =====================================================

  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    permissions: "Orders",
    users: "0",
    status: "Active",
    icon: "👤",
  });

  // =====================================================
  // LOAD SAVED SETTINGS
  // =====================================================

  useEffect(() => {
    try {
      const savedGeneral =
        localStorage.getItem(
          "pizzaFlyGeneralSettings"
        );

      const savedFeatures =
        localStorage.getItem(
          "pizzaFlyFeatures"
        );

      const savedRoles =
        localStorage.getItem(
          "pizzaFlyAdminRoles"
        );

      if (savedGeneral) {
        setGeneralSettings(
          JSON.parse(savedGeneral)
        );
      }

      if (savedFeatures) {
        setFeatures(
          JSON.parse(savedFeatures)
        );
      }

      if (savedRoles) {
        setRoles(JSON.parse(savedRoles));
      }
    } catch (error) {
      console.error(
        "Settings load error:",
        error
      );
    }
  }, []);

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSaveSettings = () => {
    localStorage.setItem(
      "pizzaFlyGeneralSettings",
      JSON.stringify(generalSettings)
    );

    localStorage.setItem(
      "pizzaFlyFeatures",
      JSON.stringify(features)
    );

    localStorage.setItem(
      "pizzaFlyAdminRoles",
      JSON.stringify(roles)
    );

    setSavedMessage("Settings saved successfully!");

    setTimeout(() => {
      setSavedMessage("");
    }, 2500);
  };

  // =====================================================
  // GENERAL INPUT
  // =====================================================

  const handleGeneralChange = (field, value) => {
    setGeneralSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =====================================================
  // FEATURE TOGGLE
  // =====================================================

  const toggleFeature = (feature) => {
    setFeatures((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  };

  // =====================================================
  // RESET ROLE FORM
  // =====================================================

  const resetRoleForm = () => {
    setRoleForm({
      name: "",
      description: "",
      permissions: "Orders",
      users: "0",
      status: "Active",
      icon: "👤",
    });

    setEditingRoleId(null);
    setShowRoleForm(false);
  };

  // =====================================================
  // OPEN ADD ROLE
  // =====================================================

  const handleAddRole = () => {
    resetRoleForm();

    setShowRoleForm(true);

    setTimeout(() => {
      document
        .querySelector(".role-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 50);
  };

  // =====================================================
  // OPEN EDIT ROLE
  // =====================================================

  const handleEditRole = (role) => {
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      users: String(role.users),
      status: role.status,
      icon: role.icon || "👤",
    });

    setEditingRoleId(role.id);
    setShowRoleForm(true);

    setTimeout(() => {
      document
        .querySelector(".role-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 50);
  };

  // =====================================================
  // ROLE FORM INPUT
  // =====================================================

  const handleRoleChange = (field, value) => {
    setRoleForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =====================================================
  // SAVE ROLE
  // =====================================================

  const handleSaveRole = () => {
    if (!roleForm.name.trim()) {
      alert("Please enter a role name.");
      return;
    }

    if (!roleForm.description.trim()) {
      alert("Please enter a role description.");
      return;
    }

    if (editingRoleId !== null) {
      // EDIT EXISTING ROLE

      setRoles((prev) =>
        prev.map((role) =>
          role.id === editingRoleId
            ? {
                ...role,
                name: roleForm.name.trim(),
                description:
                  roleForm.description.trim(),
                permissions:
                  roleForm.permissions,
                users:
                  Number(roleForm.users) || 0,
                status: roleForm.status,
                icon: roleForm.icon || "👤",
              }
            : role
        )
      );
    } else {
      // ADD NEW ROLE

      const newRole = {
        id: Date.now(),
        name: roleForm.name.trim(),
        description:
          roleForm.description.trim(),
        permissions:
          roleForm.permissions,
        users:
          Number(roleForm.users) || 0,
        status: roleForm.status,
        icon: roleForm.icon || "👤",
      };

      setRoles((prev) => [
        ...prev,
        newRole,
      ]);
    }

    resetRoleForm();
  };

  // =====================================================
  // DELETE ROLE
  // =====================================================

  const handleDeleteRole = (role) => {
    if (role.name === "Super Admin") {
      alert(
        "Super Admin role cannot be deleted."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${role.name}" role?`
    );

    if (!confirmed) return;

    setRoles((prev) =>
      prev.filter(
        (item) => item.id !== role.id
      )
    );
  };

  // =====================================================
  // SETTINGS MENU
  // =====================================================

  const settingsMenu = [
    {
      name: "General",
      icon: "⚙️",
      description: "Restaurant information",
    },
    {
      name: "Orders",
      icon: "🛒",
      description: "Order configuration",
    },
    {
      name: "Payments",
      icon: "💳",
      description: "Payment methods",
    },
    {
      name: "Delivery",
      icon: "🚚",
      description: "Delivery settings",
    },
    {
      name: "Notifications",
      icon: "🔔",
      description: "Alerts & notifications",
    },
    {
      name: "Administration",
      icon: "👥",
      description: "Roles & permissions",
    },
    {
      name: "Security",
      icon: "🔐",
      description: "Security & access",
    },
  ];

  // =====================================================
  // RENDER GENERAL
  // =====================================================

  const renderGeneral = () => (
    <div className="settings-card">
      <div className="settings-card-header">
        <div>
          <h3>Restaurant Information</h3>

          <p>
            Manage your restaurant's basic
            information and business details.
          </p>
        </div>

        <div className="settings-card-icon">
          🍕
        </div>
      </div>

      <div className="settings-form-grid">

        <div className="settings-field">
          <label>Restaurant Name</label>

          <input
            type="text"
            value={
              generalSettings.restaurantName
            }
            onChange={(e) =>
              handleGeneralChange(
                "restaurantName",
                e.target.value
              )
            }
          />
        </div>

        <div className="settings-field">
          <label>Business Email</label>

          <input
            type="email"
            value={
              generalSettings.email
            }
            onChange={(e) =>
              handleGeneralChange(
                "email",
                e.target.value
              )
            }
          />
        </div>

        <div className="settings-field">
          <label>Phone Number</label>

          <input
            type="text"
            value={
              generalSettings.phone
            }
            onChange={(e) =>
              handleGeneralChange(
                "phone",
                e.target.value
              )
            }
          />
        </div>

        <div className="settings-field">
          <label>Address</label>

          <input
            type="text"
            value={
              generalSettings.address
            }
            onChange={(e) =>
              handleGeneralChange(
                "address",
                e.target.value
              )
            }
          />
        </div>

        <div className="settings-field">
          <label>Currency</label>

          <select
            value={
              generalSettings.currency
            }
            onChange={(e) =>
              handleGeneralChange(
                "currency",
                e.target.value
              )
            }
          >
            <option value="BDT">
              BDT - Bangladeshi Taka
            </option>

            <option value="USD">
              USD - US Dollar
            </option>
          </select>
        </div>

        <div className="settings-field">
          <label>Tax</label>

          <div className="input-with-unit">
            <input
              type="number"
              value={
                generalSettings.tax
              }
              onChange={(e) =>
                handleGeneralChange(
                  "tax",
                  e.target.value
                )
              }
            />

            <span>%</span>
          </div>
        </div>

        <div className="settings-field">
          <label>Delivery Fee</label>

          <div className="input-with-unit">
            <input
              type="number"
              value={
                generalSettings.deliveryFee
              }
              onChange={(e) =>
                handleGeneralChange(
                  "deliveryFee",
                  e.target.value
                )
              }
            />

            <span>৳ BDT</span>
          </div>
        </div>

        <div className="settings-field">
          <label>Minimum Order</label>

          <div className="input-with-unit">
            <input
              type="number"
              value={
                generalSettings.minOrder
              }
              onChange={(e) =>
                handleGeneralChange(
                  "minOrder",
                  e.target.value
                )
              }
            />

            <span>৳ BDT</span>
          </div>
        </div>

      </div>

      <div className="settings-info-box">
        💡 These settings control the
        basic information displayed across
        your PizzaFly restaurant system.
      </div>
    </div>
  );

  // =====================================================
  // RENDER ORDERS
  // =====================================================

  const renderOrders = () => (
    <div className="settings-card">

      <div className="settings-card-header">
        <div>
          <h3>Order Settings</h3>

          <p>
            Configure how customer orders
            are handled.
          </p>
        </div>

        <div className="settings-card-icon">
          🛒
        </div>
      </div>

      <div className="settings-toggle-list">

        <ToggleRow
          title="Online Orders"
          description="Allow customers to place orders online."
          active={features.onlineOrders}
          onClick={() =>
            toggleFeature("onlineOrders")
          }
        />

        <ToggleRow
          title="Cash on Delivery"
          description="Allow customers to pay when the order arrives."
          active={features.cashOnDelivery}
          onClick={() =>
            toggleFeature("cashOnDelivery")
          }
        />

        <ToggleRow
          title="Online Payment"
          description="Allow customers to pay online."
          active={features.onlinePayment}
          onClick={() =>
            toggleFeature("onlinePayment")
          }
        />

        <ToggleRow
          title="Order Notifications"
          description="Show notifications when a new order arrives."
          active={features.orderNotifications}
          onClick={() =>
            toggleFeature(
              "orderNotifications"
            )
          }
        />

      </div>
    </div>
  );

  // =====================================================
  // RENDER PAYMENTS
  // =====================================================

  const renderPayments = () => (
    <div className="settings-card">

      <div className="settings-card-header">
        <div>
          <h3>Payment Settings</h3>

          <p>
            Manage available customer
            payment methods.
          </p>
        </div>

        <div className="settings-card-icon">
          💳
        </div>
      </div>

      <div className="settings-toggle-list">

        <ToggleRow
          title="Cash on Delivery"
          description="Accept cash payment during delivery."
          active={features.cashOnDelivery}
          onClick={() =>
            toggleFeature("cashOnDelivery")
          }
        />

        <ToggleRow
          title="Online Payment"
          description="Enable online payment for customers."
          active={features.onlinePayment}
          onClick={() =>
            toggleFeature("onlinePayment")
          }
        />

      </div>

      <div className="payment-method-grid">

        <div className="payment-method">
          <span>💵</span>

          <div>
            <strong>
              Cash on Delivery
            </strong>

            <small>
              Available
            </small>
          </div>
        </div>

        <div className="payment-method">
          <span>📱</span>

          <div>
            <strong>
              Mobile Banking
            </strong>

            <small>
              bKash / Nagad
            </small>
          </div>
        </div>

        <div className="payment-method">
          <span>💳</span>

          <div>
            <strong>
              Card Payment
            </strong>

            <small>
              Visa / Mastercard
            </small>
          </div>
        </div>

      </div>
    </div>
  );

  // =====================================================
  // DELIVERY
  // =====================================================

  const renderDelivery = () => (
    <div className="settings-card">

      <div className="settings-card-header">
        <div>
          <h3>Delivery Settings</h3>

          <p>
            Configure restaurant delivery
            operations.
          </p>
        </div>

        <div className="settings-card-icon">
          🚚
        </div>
      </div>

      <div className="settings-toggle-list">

        <ToggleRow
          title="Drone Delivery"
          description="Enable PizzaFly drone delivery operations."
          active={features.droneDelivery}
          onClick={() =>
            toggleFeature("droneDelivery")
          }
        />

      </div>

      <div className="settings-form-grid delivery-fields">

        <div className="settings-field">
          <label>Delivery Radius</label>

          <div className="input-with-unit">
            <input
              type="number"
              defaultValue="10"
            />

            <span>KM</span>
          </div>
        </div>

        <div className="settings-field">
          <label>Estimated Delivery</label>

          <div className="input-with-unit">
            <input
              type="number"
              defaultValue="30"
            />

            <span>MIN</span>
          </div>
        </div>

      </div>
    </div>
  );

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const renderNotifications = () => (
    <div className="settings-card">

      <div className="settings-card-header">
        <div>
          <h3>Notifications</h3>

          <p>
            Control admin and customer
            notifications.
          </p>
        </div>

        <div className="settings-card-icon">
          🔔
        </div>
      </div>

      <div className="settings-toggle-list">

        <ToggleRow
          title="Order Notifications"
          description="Receive alerts when a new order is placed."
          active={features.orderNotifications}
          onClick={() =>
            toggleFeature(
              "orderNotifications"
            )
          }
        />

        <ToggleRow
          title="SMS Notifications"
          description="Send order updates through SMS."
          active={features.smsNotifications}
          onClick={() =>
            toggleFeature(
              "smsNotifications"
            )
          }
        />

        <ToggleRow
          title="Email Notifications"
          description="Send order and system updates through email."
          active={features.emailNotifications}
          onClick={() =>
            toggleFeature(
              "emailNotifications"
            )
          }
        />

      </div>
    </div>
  );

  // =====================================================
  // ADMINISTRATION
  // =====================================================

  const renderAdministration = () => {

    const totalUsers = roles.reduce(
      (sum, role) =>
        sum + Number(role.users || 0),
      0
    );

    const activeRoles = roles.filter(
      (role) =>
        role.status === "Active"
    ).length;

    return (
      <div className="settings-card">

        <div className="settings-card-header">

          <div>
            <h3>
              Administration
            </h3>

            <p>
              Manage administrator roles,
              users and permissions.
            </p>
          </div>

          <div className="settings-card-icon">
            👥
          </div>

        </div>

        {/* SUMMARY */}

        <div className="admin-summary">

          <div className="admin-summary-card">
            <span>👥</span>

            <div>
              <strong>
                {totalUsers}
              </strong>

              <small>
                Admin Users
              </small>
            </div>
          </div>

          <div className="admin-summary-card">
            <span>🛡️</span>

            <div>
              <strong>
                {roles.length}
              </strong>

              <small>
                Total Roles
              </small>
            </div>
          </div>

          <div className="admin-summary-card">
            <span>✅</span>

            <div>
              <strong>
                {activeRoles}
              </strong>

              <small>
                Active Roles
              </small>
            </div>
          </div>

        </div>

        {/* ROLE HEADER */}

        <div className="role-management-header">

          <div>
            <h4>
              Role Management
            </h4>

            <p>
              Create and manage restaurant
              administration roles.
            </p>
          </div>

          <button
            className="add-role-btn"
            onClick={handleAddRole}
          >
            + Add New Role
          </button>

        </div>

        {/* ROLE FORM */}

        {showRoleForm && (
          <div className="role-form">

            <div className="role-form-title">
              <div>
                <h4>
                  {editingRoleId !== null
                    ? "Edit Role"
                    : "Create New Role"}
                </h4>

                <p>
                  {editingRoleId !== null
                    ? "Update role information and permissions."
                    : "Add a new administration role."}
                </p>
              </div>

              <span>
                {editingRoleId !== null
                  ? "✏️"
                  : "➕"}
              </span>
            </div>

            <div className="settings-form-grid">

              <div className="settings-field">
                <label>
                  Role Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Branch Manager"
                  value={roleForm.name}
                  onChange={(e) =>
                    handleRoleChange(
                      "name",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="settings-field">
                <label>
                  Icon
                </label>

                <input
                  type="text"
                  placeholder="👤"
                  value={roleForm.icon}
                  onChange={(e) =>
                    handleRoleChange(
                      "icon",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="settings-field">
                <label>
                  Description
                </label>

                <input
                  type="text"
                  placeholder="Role description"
                  value={
                    roleForm.description
                  }
                  onChange={(e) =>
                    handleRoleChange(
                      "description",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="settings-field">
                <label>
                  Permissions
                </label>

                <select
                  value={
                    roleForm.permissions
                  }
                  onChange={(e) =>
                    handleRoleChange(
                      "permissions",
                      e.target.value
                    )
                  }
                >
                  <option>
                    All Permissions
                  </option>

                  <option>
                    Orders, Customers, Reports
                  </option>

                  <option>
                    Orders, Delivery
                  </option>

                  <option>
                    Orders, Kitchen
                  </option>

                  <option>
                    Customers
                  </option>

                  <option>
                    Reports
                  </option>

                  <option>
                    View Only
                  </option>
                </select>
              </div>

              <div className="settings-field">
                <label>
                  Users
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    roleForm.users
                  }
                  onChange={(e) =>
                    handleRoleChange(
                      "users",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="settings-field">
                <label>
                  Status
                </label>

                <select
                  value={
                    roleForm.status
                  }
                  onChange={(e) =>
                    handleRoleChange(
                      "status",
                      e.target.value
                    )
                  }
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

            </div>

            <div className="role-form-actions">

              <button
                className="cancel-role-btn"
                onClick={resetRoleForm}
              >
                Cancel
              </button>

              <button
                className="save-role-btn"
                onClick={handleSaveRole}
              >
                {editingRoleId !== null
                  ? "Update Role"
                  : "Create Role"}
              </button>

            </div>

          </div>
        )}

        {/* ROLES */}

        <div className="roles-list">

          {roles.map((role) => (
            <div
              className="role-item"
              key={role.id}
            >

              <div className="role-icon">
                {role.icon}
              </div>

              <div className="role-info">
                <strong>
                  {role.name}
                </strong>

                <small>
                  {role.description}
                </small>
              </div>

              <div className="role-permissions">
                <span>
                  {role.permissions}
                </span>
              </div>

              <div className="role-users">
                <strong>
                  {role.users}
                </strong>

                <small>
                  Users
                </small>
              </div>

              <span
                className={
                  role.status === "Active"
                    ? "role-status active"
                    : "role-status inactive"
                }
              >
                {role.status}
              </span>

              {/* ACTIONS */}

              <div className="role-actions">

                <button
                  className="role-edit-btn"
                  onClick={() =>
                    handleEditRole(role)
                  }
                  title="Edit Role"
                >
                  ✏️
                </button>

                <button
                  className="role-delete-btn"
                  onClick={() =>
                    handleDeleteRole(role)
                  }
                  title="Delete Role"
                >
                  🗑️
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    );
  };

  // =====================================================
  // SECURITY
  // =====================================================

  const renderSecurity = () => (
    <div className="settings-card">

      <div className="settings-card-header">
        <div>
          <h3>
            Security & Access
          </h3>

          <p>
            Manage administrator security
            settings.
          </p>
        </div>

        <div className="settings-card-icon">
          🔐
        </div>
      </div>

      <div className="settings-profile">

        <div className="settings-avatar">
          A
        </div>

        <div>
          <strong>
            Administrator
          </strong>

          <small>
            admin@pizzafly.com
          </small>
        </div>

      </div>

      <div className="security-actions">

        <button
          onClick={() =>
            alert(
              "Password change feature will be connected to authentication later."
            )
          }
        >
          🔑 Change Password
        </button>

        <button
          onClick={() =>
            alert(
              "Two-factor authentication setup."
            )
          }
        >
          🛡️ Two-Factor Authentication
        </button>

      </div>

      <div className="settings-toggle-list">

        <ToggleRow
          title="Maintenance Mode"
          description="Temporarily disable customer ordering."
          active={features.maintenanceMode}
          onClick={() =>
            toggleFeature(
              "maintenanceMode"
            )
          }
        />

      </div>

      <div className="danger-zone">

        <div>
          <strong>
            Danger Zone
          </strong>

          <p>
            Be careful when changing
            critical system settings.
          </p>
        </div>

        <button
          className="danger-btn"
          onClick={() =>
            alert(
              "This action is disabled in demo mode."
            )
          }
        >
          Reset Settings
        </button>

      </div>

    </div>
  );

  // =====================================================
  // ACTIVE CONTENT
  // =====================================================

  const renderContent = () => {
    switch (activeSection) {
      case "Orders":
        return renderOrders();

      case "Payments":
        return renderPayments();

      case "Delivery":
        return renderDelivery();

      case "Notifications":
        return renderNotifications();

      case "Administration":
        return renderAdministration();

      case "Security":
        return renderSecurity();

      default:
        return renderGeneral();
    }
  };

  return (
    <div className="settings-page">

      {/* HEADER */}

      <div className="settings-header">

        <div>
          <h2>Settings</h2>

          <p>
            Manage your PizzaFly restaurant
            configuration and administration.
          </p>
        </div>

        <div className="settings-header-actions">

          {savedMessage && (
            <span className="saved-message">
              ✓ {savedMessage}
            </span>
          )}

          <button
            className="settings-save-btn"
            onClick={handleSaveSettings}
          >
            💾 Save Changes
          </button>

        </div>

      </div>

      {/* LAYOUT */}

      <div className="settings-layout">

        {/* SIDEBAR */}

        <aside className="settings-menu">

          <div className="settings-menu-title">
            SETTINGS
          </div>

          {settingsMenu.map((item) => (
            <button
              key={item.name}
              className={
                activeSection === item.name
                  ? "settings-menu-item active"
                  : "settings-menu-item"
              }
              onClick={() =>
                setActiveSection(item.name)
              }
            >

              <span className="settings-menu-icon">
                {item.icon}
              </span>

              <span className="settings-menu-text">

                <strong>
                  {item.name}
                </strong>

                <small>
                  {item.description}
                </small>

              </span>

              <span className="settings-arrow">
                →
              </span>

            </button>
          ))}

        </aside>

        {/* CONTENT */}

        <main className="settings-content">

          {renderContent()}

        </main>

      </div>

    </div>
  );
}

// =====================================================
// TOGGLE COMPONENT
// =====================================================

function ToggleRow({
  title,
  description,
  active,
  onClick,
}) {
  return (
    <div className="settings-toggle-row">

      <div>
        <strong>
          {title}
        </strong>

        <p>
          {description}
        </p>
      </div>

      <button
        type="button"
        className={
          active
            ? "toggle active"
            : "toggle"
        }
        onClick={onClick}
        aria-label={`Toggle ${title}`}
      >
        <span />
      </button>

    </div>
  );
}

export default AdminSettings;