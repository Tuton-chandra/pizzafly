import { useEffect, useMemo, useState } from "react";
import "./AdminAdministration.css";

const DEFAULT_ROLES = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full access to the entire restaurant system.",
    icon: "👑",
    color: "orange",
    permissions: {
      dashboard: true,
      orders: true,
      menu: true,
      customers: true,
      drones: true,
      tracking: true,
      payments: true,
      reports: true,
      settings: true,
      staff: true,
    },
  },
  {
    id: "manager",
    name: "Restaurant Manager",
    description: "Manage daily restaurant operations.",
    icon: "👨‍💼",
    color: "blue",
    permissions: {
      dashboard: true,
      orders: true,
      menu: true,
      customers: true,
      drones: true,
      tracking: true,
      payments: true,
      reports: true,
      settings: false,
      staff: true,
    },
  },
  {
    id: "order-manager",
    name: "Order Manager",
    description: "Manage customer orders and order status.",
    icon: "🛒",
    color: "purple",
    permissions: {
      dashboard: true,
      orders: true,
      menu: false,
      customers: true,
      drones: false,
      tracking: true,
      payments: false,
      reports: false,
      settings: false,
      staff: false,
    },
  },
  {
    id: "kitchen",
    name: "Kitchen Staff",
    description: "Manage food preparation and kitchen orders.",
    icon: "👨‍🍳",
    color: "red",
    permissions: {
      dashboard: true,
      orders: true,
      menu: true,
      customers: false,
      drones: false,
      tracking: false,
      payments: false,
      reports: false,
      settings: false,
      staff: false,
    },
  },
  {
    id: "delivery",
    name: "Delivery Manager",
    description: "Manage drones and delivery operations.",
    icon: "🚁",
    color: "green",
    permissions: {
      dashboard: true,
      orders: true,
      menu: false,
      customers: true,
      drones: true,
      tracking: true,
      payments: false,
      reports: false,
      settings: false,
      staff: false,
    },
  },
  {
    id: "accountant",
    name: "Accountant",
    description: "Manage payments and financial reports.",
    icon: "💰",
    color: "yellow",
    permissions: {
      dashboard: true,
      orders: false,
      menu: false,
      customers: false,
      drones: false,
      tracking: false,
      payments: true,
      reports: true,
      settings: false,
      staff: false,
    },
  },
];

const DEFAULT_STAFF = [
  {
    id: 1,
    name: "Admin",
    email: "admin@pizzafly.com",
    phone: "01700000000",
    role: "Administrator",
    status: "Active",
    lastLogin: "Today, 10:30 AM",
  },
  {
    id: 2,
    name: "Restaurant Manager",
    email: "manager@pizzafly.com",
    phone: "01700000001",
    role: "Restaurant Manager",
    status: "Active",
    lastLogin: "Today, 09:45 AM",
  },
  {
    id: 3,
    name: "Kitchen Staff",
    email: "kitchen@pizzafly.com",
    phone: "01700000002",
    role: "Kitchen Staff",
    status: "Active",
    lastLogin: "Today, 08:20 AM",
  },
  {
    id: 4,
    name: "Delivery Manager",
    email: "delivery@pizzafly.com",
    phone: "01700000003",
    role: "Delivery Manager",
    status: "Active",
    lastLogin: "Yesterday",
  },
];

const PERMISSION_LIST = [
  ["dashboard", "Dashboard"],
  ["orders", "Orders"],
  ["menu", "Pizza Menu"],
  ["customers", "Customers"],
  ["drones", "Drones"],
  ["tracking", "Live Tracking"],
  ["payments", "Payments"],
  ["reports", "Reports"],
  ["settings", "Settings"],
  ["staff", "Staff Management"],
];

function AdminAdministration() {
  const [roles, setRoles] = useState(() => {
    try {
      const saved = localStorage.getItem("pizzafly_roles");
      return saved ? JSON.parse(saved) : DEFAULT_ROLES;
    } catch {
      return DEFAULT_ROLES;
    }
  });

  const [staff, setStaff] = useState(() => {
    try {
      const saved = localStorage.getItem("pizzafly_staff");
      return saved ? JSON.parse(saved) : DEFAULT_STAFF;
    } catch {
      return DEFAULT_STAFF;
    }
  });

  const [activeTab, setActiveTab] = useState("staff");
  const [search, setSearch] = useState("");

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const [editingStaff, setEditingStaff] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Restaurant Manager",
    status: "Active",
  });

  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    icon: "👤",
    permissions: {},
  });

  useEffect(() => {
    localStorage.setItem(
      "pizzafly_roles",
      JSON.stringify(roles)
    );
  }, [roles]);

  useEffect(() => {
    localStorage.setItem(
      "pizzafly_staff",
      JSON.stringify(staff)
    );
  }, [staff]);

  const activeStaff = staff.filter(
    (member) => member.status === "Active"
  ).length;

  const suspendedStaff = staff.filter(
    (member) => member.status === "Suspended"
  ).length;

  const filteredStaff = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return staff;

    return staff.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.phone.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query)
    );
  }, [staff, search]);

  const openAddStaff = () => {
    setEditingStaff(null);

    setStaffForm({
      name: "",
      email: "",
      phone: "",
      role: "Restaurant Manager",
      status: "Active",
    });

    setShowStaffModal(true);
  };

  const openEditStaff = (member) => {
    setEditingStaff(member);

    setStaffForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      status: member.status,
    });

    setShowStaffModal(true);
  };

  const saveStaff = (e) => {
    e.preventDefault();

    if (!staffForm.name.trim()) {
      alert("Please enter staff name.");
      return;
    }

    if (!staffForm.email.trim()) {
      alert("Please enter email address.");
      return;
    }

    if (editingStaff) {
      setStaff((current) =>
        current.map((member) =>
          member.id === editingStaff.id
            ? {
                ...member,
                ...staffForm,
              }
            : member
        )
      );
    } else {
      const newStaff = {
        id: Date.now(),
        ...staffForm,
        lastLogin: "Never",
      };

      setStaff((current) => [
        ...current,
        newStaff,
      ]);
    }

    setShowStaffModal(false);
  };

  const toggleStaffStatus = (id) => {
    setStaff((current) =>
      current.map((member) =>
        member.id === id
          ? {
              ...member,
              status:
                member.status === "Active"
                  ? "Suspended"
                  : "Active",
            }
          : member
      )
    );
  };

  const deleteStaff = (id) => {
    const member = staff.find(
      (item) => item.id === id
    );

    if (!member) return;

    const confirmDelete = window.confirm(
      `Remove ${member.name} from staff?`
    );

    if (!confirmDelete) return;

    setStaff((current) =>
      current.filter(
        (member) => member.id !== id
      )
    );
  };

  const openAddRole = () => {
    setEditingRole(null);

    const permissions = {};

    PERMISSION_LIST.forEach(([key]) => {
      permissions[key] = false;
    });

    setRoleForm({
      name: "",
      description: "",
      icon: "👤",
      permissions,
    });

    setShowRoleModal(true);
  };

  const openEditRole = (role) => {
    setEditingRole(role);

    setRoleForm({
      name: role.name,
      description: role.description,
      icon: role.icon,
      permissions: {
        ...role.permissions,
      },
    });

    setShowRoleModal(true);
  };

  const togglePermission = (permission) => {
    setRoleForm((current) => ({
      ...current,
      permissions: {
        ...current.permissions,
        [permission]:
          !current.permissions[permission],
      },
    }));
  };

  const saveRole = (e) => {
    e.preventDefault();

    if (!roleForm.name.trim()) {
      alert("Please enter role name.");
      return;
    }

    if (editingRole) {
      setRoles((current) =>
        current.map((role) =>
          role.id === editingRole.id
            ? {
                ...role,
                name: roleForm.name,
                description:
                  roleForm.description,
                icon: roleForm.icon,
                permissions:
                  roleForm.permissions,
              }
            : role
        )
      );
    } else {
      const newRole = {
        id:
          roleForm.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-") +
          "-" +
          Date.now(),

        name: roleForm.name,

        description:
          roleForm.description,

        icon: roleForm.icon,

        color: "blue",

        permissions:
          roleForm.permissions,
      };

      setRoles((current) => [
        ...current,
        newRole,
      ]);
    }

    setShowRoleModal(false);
  };

  const deleteRole = (id) => {
    const role = roles.find(
      (item) => item.id === id
    );

    if (!role) return;

    const usedByStaff = staff.some(
      (member) => member.role === role.name
    );

    if (usedByStaff) {
      alert(
        "This role is currently assigned to staff. Change their role first."
      );
      return;
    }

    if (
      !window.confirm(
        `Delete ${role.name} role?`
      )
    ) {
      return;
    }

    setRoles((current) =>
      current.filter(
        (role) => role.id !== id
      )
    );
  };

  const roleUserCount = (roleName) =>
    staff.filter(
      (member) => member.role === roleName
    ).length;

  return (
    <div className="administration-page">

      {/* PAGE HEADER */}

      <div className="administration-header">

        <div>
          <div className="page-kicker">
            ADMINISTRATION
          </div>

          <h2>
            Staff & Role Management
          </h2>

          <p>
            Manage restaurant staff, roles and
            system permissions from one place.
          </p>
        </div>

        <button
          className="primary-admin-btn"
          onClick={
            activeTab === "staff"
              ? openAddStaff
              : openAddRole
          }
        >
          +
          {activeTab === "staff"
            ? " Add Staff"
            : " Create Role"}
        </button>

      </div>


      {/* SUMMARY CARDS */}

      <div className="administration-stats">

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            👥
          </div>

          <div>
            <span>Total Staff</span>
            <strong>{staff.length}</strong>
            <small>Restaurant team members</small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon green">
            🟢
          </div>

          <div>
            <span>Active Staff</span>
            <strong>{activeStaff}</strong>
            <small>Currently active accounts</small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon orange">
            🔐
          </div>

          <div>
            <span>Total Roles</span>
            <strong>{roles.length}</strong>
            <small>Available system roles</small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon red">
            ⛔
          </div>

          <div>
            <span>Suspended</span>
            <strong>{suspendedStaff}</strong>
            <small>Inactive staff accounts</small>
          </div>
        </div>

      </div>


      {/* TABS */}

      <div className="administration-tabs">

        <button
          className={
            activeTab === "staff"
              ? "active"
              : ""
          }
          onClick={() => setActiveTab("staff")}
        >
          👥 Staff Management
        </button>

        <button
          className={
            activeTab === "roles"
              ? "active"
              : ""
          }
          onClick={() => setActiveTab("roles")}
        >
          🔐 Role Management
        </button>

        <button
          className={
            activeTab === "permissions"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("permissions")
          }
        >
          🛡 Permissions
        </button>

      </div>


      {/* STAFF */}

      {activeTab === "staff" && (
        <section className="admin-section-card">

          <div className="section-card-header">

            <div>
              <h3>Restaurant Staff</h3>
              <p>
                Manage employee accounts and
                access status.
              </p>
            </div>

            <div className="admin-table-search">
              🔍

              <input
                type="text"
                placeholder="Search staff..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

          </div>


          <div className="admin-table-wrapper">

            <table className="admin-management-table">

              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredStaff.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="admin-empty"
                    >
                      👥
                      <strong>
                        No staff found
                      </strong>
                      <span>
                        Try another search.
                      </span>
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map(
                    (member) => (
                      <tr key={member.id}>

                        <td>
                          <div className="staff-person">

                            <div className="staff-avatar">
                              {member.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {member.name}
                              </strong>

                              <small>
                                Staff ID #
                                {member.id}
                              </small>
                            </div>

                          </div>
                        </td>

                        <td>
                          <strong>
                            {member.email}
                          </strong>

                          <small className="table-muted">
                            {member.phone ||
                              "No phone"}
                          </small>
                        </td>

                        <td>
                          <span className="role-badge">
                            {member.role}
                          </span>
                        </td>

                        <td>
                          <button
                            className={
                              member.status ===
                              "Active"
                                ? "status-pill active"
                                : "status-pill suspended"
                            }
                            onClick={() =>
                              toggleStaffStatus(
                                member.id
                              )
                            }
                          >
                            ● {member.status}
                          </button>
                        </td>

                        <td>
                          <span className="table-muted">
                            {member.lastLogin}
                          </span>
                        </td>

                        <td>
                          <div className="table-actions">

                            <button
                              title="Edit"
                              onClick={() =>
                                openEditStaff(
                                  member
                                )
                              }
                            >
                              ✏️
                            </button>

                            <button
                              title="Delete"
                              className="danger"
                              onClick={() =>
                                deleteStaff(
                                  member.id
                                )
                              }
                            >
                              🗑️
                            </button>

                          </div>
                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>

          </div>

        </section>
      )}


      {/* ROLES */}

      {activeTab === "roles" && (
        <section className="roles-grid">

          {roles.map((role) => (
            <div
              className="role-card"
              key={role.id}
            >

              <div className="role-card-top">

                <div className="role-icon">
                  {role.icon}
                </div>

                <div className="role-card-actions">

                  <button
                    onClick={() =>
                      openEditRole(role)
                    }
                    title="Edit role"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() =>
                      deleteRole(role.id)
                    }
                    title="Delete role"
                    className="danger"
                  >
                    🗑️
                  </button>

                </div>

              </div>

              <h3>{role.name}</h3>

              <p>
                {role.description}
              </p>

              <div className="role-users">
                👥
                <strong>
                  {roleUserCount(role.name)}
                </strong>
                <span>
                  staff member
                  {roleUserCount(
                    role.name
                  ) !== 1
                    ? "s"
                    : ""}
                </span>
              </div>

              <div className="role-permission-preview">

                {PERMISSION_LIST
                  .filter(
                    ([key]) =>
                      role.permissions[key]
                  )
                  .slice(0, 5)
                  .map(
                    ([, label]) => (
                      <span key={label}>
                        ✓ {label}
                      </span>
                    )
                  )}

                {Object.values(
                  role.permissions
                ).filter(Boolean).length >
                  5 && (
                  <span>
                    +
                    {Object.values(
                      role.permissions
                    ).filter(Boolean).length -
                      5}{" "}
                    more
                  </span>
                )}

              </div>

            </div>
          ))}

          <button
            className="create-role-card"
            onClick={openAddRole}
          >
            <span>＋</span>
            <strong>Create Custom Role</strong>
            <small>
              Create a role with custom
              permissions
            </small>
          </button>

        </section>
      )}


      {/* PERMISSIONS */}

      {activeTab === "permissions" && (
        <section className="admin-section-card">

          <div className="section-card-header">

            <div>
              <h3>Role Permissions</h3>

              <p>
                Overview of permissions assigned
                to each restaurant role.
              </p>
            </div>

          </div>


          <div className="permission-table-wrapper">

            <table className="permission-table">

              <thead>

                <tr>
                  <th>Permission</th>

                  {roles.map((role) => (
                    <th key={role.id}>
                      {role.icon}
                      <br />
                      {role.name}
                    </th>
                  ))}

                </tr>

              </thead>

              <tbody>

                {PERMISSION_LIST.map(
                  ([key, label]) => (
                    <tr key={key}>

                      <td>
                        <strong>
                          {label}
                        </strong>
                      </td>

                      {roles.map((role) => (
                        <td
                          key={role.id}
                          className={
                            role.permissions[
                              key
                            ]
                              ? "permission-yes"
                              : "permission-no"
                          }
                        >
                          {role.permissions[key]
                            ? "✓"
                            : "—"}
                        </td>
                      ))}

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </section>
      )}


      {/* STAFF MODAL */}

      {showStaffModal && (
        <div
          className="admin-modal-overlay"
          onMouseDown={() =>
            setShowStaffModal(false)
          }
        >

          <form
            className="admin-modal"
            onSubmit={saveStaff}
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <span>
                  👤 Staff Account
                </span>

                <h3>
                  {editingStaff
                    ? "Edit Staff"
                    : "Add New Staff"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowStaffModal(false)
                }
              >
                ×
              </button>

            </div>


            <div className="modal-form-grid">

              <label>
                Full Name

                <input
                  value={staffForm.name}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. John Doe"
                />
              </label>

              <label>
                Email Address

                <input
                  type="email"
                  value={staffForm.email}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      email:
                        e.target.value,
                    })
                  }
                  placeholder="staff@pizzafly.com"
                />
              </label>

              <label>
                Phone Number

                <input
                  value={staffForm.phone}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      phone:
                        e.target.value,
                    })
                  }
                  placeholder="017XXXXXXXX"
                />
              </label>

              <label>
                Role

                <select
                  value={staffForm.role}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      role:
                        e.target.value,
                    })
                  }
                >
                  {roles.map((role) => (
                    <option
                      key={role.id}
                      value={role.name}
                    >
                      {role.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Account Status

                <select
                  value={staffForm.status}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      status:
                        e.target.value,
                    })
                  }
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Suspended">
                    Suspended
                  </option>
                </select>
              </label>

            </div>


            <div className="modal-footer">

              <button
                type="button"
                className="secondary-btn"
                onClick={() =>
                  setShowStaffModal(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-admin-btn"
              >
                {editingStaff
                  ? "Save Changes"
                  : "Create Staff"}
              </button>

            </div>

          </form>

        </div>
      )}


      {/* ROLE MODAL */}

      {showRoleModal && (
        <div
          className="admin-modal-overlay"
          onMouseDown={() =>
            setShowRoleModal(false)
          }
        >

          <form
            className="admin-modal role-modal"
            onSubmit={saveRole}
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <span>
                  🔐 Role Configuration
                </span>

                <h3>
                  {editingRole
                    ? "Edit Role"
                    : "Create Custom Role"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowRoleModal(false)
                }
              >
                ×
              </button>

            </div>


            <div className="modal-form-grid">

              <label>
                Role Name

                <input
                  value={roleForm.name}
                  onChange={(e) =>
                    setRoleForm({
                      ...roleForm,
                      name:
                        e.target.value,
                    })
                  }
                  placeholder="e.g. Shift Supervisor"
                />
              </label>

              <label>
                Role Icon

                <input
                  value={roleForm.icon}
                  onChange={(e) =>
                    setRoleForm({
                      ...roleForm,
                      icon:
                        e.target.value,
                    })
                  }
                  placeholder="👤"
                />
              </label>

              <label className="full-field">
                Description

                <textarea
                  value={roleForm.description}
                  onChange={(e) =>
                    setRoleForm({
                      ...roleForm,
                      description:
                        e.target.value,
                    })
                  }
                  placeholder="Describe what this role does..."
                  rows="3"
                />
              </label>

            </div>


            <div className="permission-editor">

              <div className="permission-editor-header">

                <div>
                  <h4>
                    Permissions
                  </h4>

                  <p>
                    Select the areas this role
                    can access.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setRoleForm({
                      ...roleForm,
                      permissions:
                        Object.fromEntries(
                          PERMISSION_LIST.map(
                            ([key]) => [
                              key,
                              true,
                            ]
                          )
                        ),
                    })
                  }
                >
                  Select All
                </button>

              </div>


              <div className="permission-check-grid">

                {PERMISSION_LIST.map(
                  ([key, label]) => (
                    <label
                      key={key}
                      className={
                        roleForm.permissions[
                          key
                        ]
                          ? "permission-check active"
                          : "permission-check"
                      }
                    >

                      <input
                        type="checkbox"
                        checked={
                          !!roleForm
                            .permissions[
                            key
                          ]
                        }
                        onChange={() =>
                          togglePermission(
                            key
                          )
                        }
                      />

                      <span>
                        {roleForm.permissions[
                          key
                        ]
                          ? "✓"
                          : ""}
                      </span>

                      {label}

                    </label>
                  )
                )}

              </div>

            </div>


            <div className="modal-footer">

              <button
                type="button"
                className="secondary-btn"
                onClick={() =>
                  setShowRoleModal(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-admin-btn"
              >
                {editingRole
                  ? "Save Role"
                  : "Create Role"}
              </button>

            </div>

          </form>

        </div>
      )}

    </div>
  );
}

export default AdminAdministration;