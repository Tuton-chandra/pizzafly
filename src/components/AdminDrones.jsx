
import { useEffect, useState } from "react";
import "./AdminDrones.css";

import {
  getDrones,
  addDrone,
  updateDrone,
  deleteDrone,
  updateDroneStatus,
} from "../utils/droneStorage.js";

function AdminDrones() {
  const [drones, setDrones] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingDrone, setEditingDrone] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    status: "Available",
    battery: 100,
    location: "PizzaFly HQ",
    eta: "—",
  });

  // =====================================================
  // LOAD DRONES
  // =====================================================

  useEffect(() => {
    const loadDrones = () => {
      setDrones(getDrones());
    };

    loadDrones();

    window.addEventListener("dronesUpdated", loadDrones);

    return () => {
      window.removeEventListener(
        "dronesUpdated",
        loadDrones
      );
    };
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({
      name: "",
      status: "Available",
      battery: 100,
      location: "PizzaFly HQ",
      eta: "—",
    });

    setEditingDrone(null);
    setShowForm(false);
  };

  // =====================================================
  // ADD DRONE
  // =====================================================

  const handleAddDrone = () => {
    setEditingDrone(null);

    setFormData({
      name: "",
      status: "Available",
      battery: 100,
      location: "PizzaFly HQ",
      eta: "—",
    });

    setShowForm(true);
  };

  // =====================================================
  // EDIT DRONE
  // =====================================================

  const handleEditDrone = (drone) => {
    setEditingDrone(drone);

    setFormData({
      name: drone.name || "",
      status: drone.status || "Available",
      battery: drone.battery ?? 100,
      location: drone.location || "PizzaFly HQ",
      eta: drone.eta || "—",
    });

    setShowForm(true);
  };

  // =====================================================
  // SUBMIT FORM
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = formData.name.trim();

    if (!name) {
      alert("Please enter drone name.");
      return;
    }

    const battery = Number(formData.battery);

    if (
      Number.isNaN(battery) ||
      battery < 0 ||
      battery > 100
    ) {
      alert("Battery must be between 0 and 100.");
      return;
    }

    const droneData = {
      name,
      status: formData.status,
      battery,
      location:
        formData.location.trim() || "PizzaFly HQ",
      eta: formData.eta.trim() || "—",
    };

    // UPDATE
    if (editingDrone) {
      const updatedDrones = updateDrone(
        editingDrone.id,
        droneData
      );

      setDrones(updatedDrones);
    }

    // ADD
    else {
      const newDrone = addDrone(droneData);

      setDrones((prev) => [
        ...prev,
        newDrone,
      ]);
    }

    resetForm();
  };

  // =====================================================
  // DELETE DRONE
  // =====================================================

  const handleDelete = (droneId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this drone?"
    );

    if (!confirmDelete) return;

    const updatedDrones = deleteDrone(droneId);

    setDrones(updatedDrones);
  };

  // =====================================================
  // STATUS CHANGE
  // =====================================================

  const handleStatusChange = (
    droneId,
    newStatus
  ) => {
    const updatedDrones =
      updateDroneStatus(
        droneId,
        newStatus
      );

    setDrones(updatedDrones);
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalDrones = drones.length;

  const availableDrones = drones.filter(
    (drone) =>
      drone.status === "Available"
  ).length;

  const inFlightDrones = drones.filter(
    (drone) =>
      drone.status === "In Flight"
  ).length;

  const chargingDrones = drones.filter(
    (drone) =>
      drone.status === "Charging"
  ).length;

  const maintenanceDrones = drones.filter(
    (drone) =>
      drone.status === "Maintenance"
  ).length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="admin-drones">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="drones-header">

        <div>
          <h2>Drone Fleet</h2>

          <p>
            Manage and monitor your PizzaFly delivery drones
          </p>
        </div>

        <button
          className="add-drone-btn"
          onClick={handleAddDrone}
        >
          + Add Drone
        </button>

      </div>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="drone-stats">

        <div className="drone-stat-card">
          <span className="drone-stat-icon">
            🚁
          </span>

          <div>
            <strong>
              {totalDrones}
            </strong>

            <small>
              Total Drones
            </small>
          </div>
        </div>


        <div className="drone-stat-card">
          <span className="drone-stat-icon">
            🟢
          </span>

          <div>
            <strong>
              {availableDrones}
            </strong>

            <small>
              Available
            </small>
          </div>
        </div>


        <div className="drone-stat-card">
          <span className="drone-stat-icon">
            ✈️
          </span>

          <div>
            <strong>
              {inFlightDrones}
            </strong>

            <small>
              In Flight
            </small>
          </div>
        </div>


        <div className="drone-stat-card">
          <span className="drone-stat-icon">
            🔋
          </span>

          <div>
            <strong>
              {chargingDrones}
            </strong>

            <small>
              Charging
            </small>
          </div>
        </div>


        <div className="drone-stat-card">
          <span className="drone-stat-icon">
            🔧
          </span>

          <div>
            <strong>
              {maintenanceDrones}
            </strong>

            <small>
              Maintenance
            </small>
          </div>
        </div>

      </div>


      {/* =====================================================
          ADD / EDIT FORM
      ===================================================== */}

      {showForm && (

        <div className="drone-form-card">

          <div className="drone-form-header">

            <div>

              <h3>
                {editingDrone
                  ? "Edit Drone"
                  : "Add New Drone"}
              </h3>

              <p>
                {editingDrone
                  ? "Update drone information"
                  : "Add a new delivery drone"}
              </p>

            </div>

            <button
              type="button"
              className="close-drone-form"
              onClick={resetForm}
            >
              ✕
            </button>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="drone-form-grid">

              {/* Drone Name */}

              <div className="drone-form-group">

                <label>
                  Drone Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="PF-105"
                  required
                />

              </div>


              {/* Status */}

              <div className="drone-form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >

                  <option value="Available">
                    Available
                  </option>

                  <option value="In Flight">
                    In Flight
                  </option>

                  <option value="Charging">
                    Charging
                  </option>

                  <option value="Maintenance">
                    Maintenance
                  </option>

                </select>

              </div>


              {/* Battery */}

              <div className="drone-form-group">

                <label>
                  Battery (%)
                </label>

                <input
                  type="number"
                  name="battery"
                  value={formData.battery}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  placeholder="100"
                  required
                />

              </div>


              {/* Location */}

              <div className="drone-form-group">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Dhanmondi"
                />

              </div>


              {/* ETA */}

              <div className="drone-form-group">

                <label>
                  ETA
                </label>

                <input
                  type="text"
                  name="eta"
                  value={formData.eta}
                  onChange={handleChange}
                  placeholder="05:20"
                />

              </div>

            </div>


            {/* Form Actions */}

            <div className="drone-form-actions">

              <button
                type="button"
                className="drone-cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="drone-save-btn"
              >
                {editingDrone
                  ? "Update Drone"
                  : "Add Drone"}
              </button>

            </div>

          </form>

        </div>

      )}


      {/* =====================================================
          DRONE LIST
      ===================================================== */}

      <div className="drone-list-card">

        <div className="drone-list-header">

          <div>

            <h3>
              All Drones
            </h3>

            <p>
              Current delivery fleet status
            </p>

          </div>

          <span>
            {totalDrones} Drones
          </span>

        </div>


        {drones.length === 0 ? (

          <div className="drone-empty">

            <div>
              🚁
            </div>

            <h3>
              No Drones Found
            </h3>

            <p>
              Add your first delivery drone.
            </p>

            <button
              onClick={handleAddDrone}
            >
              + Add Drone
            </button>

          </div>

        ) : (

          <div className="drone-table-wrapper">

            <table className="drone-table">

              <thead>

                <tr>

                  <th>
                    Drone
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Battery
                  </th>

                  <th>
                    Location
                  </th>

                  <th>
                    ETA
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {drones.map((drone) => {

                  const battery = Math.max(
                    0,
                    Math.min(
                      100,
                      Number(
                        drone.battery || 0
                      )
                    )
                  );

                  return (

                    <tr key={drone.id}>

                      {/* Drone */}

                      <td>

                        <div className="drone-info">

                          <div className="drone-avatar">
                            🚁
                          </div>

                          <div>

                            <strong>
                              {drone.name ||
                                drone.id}
                            </strong>

                            <small>
                              {drone.id}
                            </small>

                          </div>

                        </div>

                      </td>


                      {/* Status */}

                      <td>

                        <select
                          className={`drone-status-select ${
                            drone.status
                              ?.toLowerCase()
                              .replaceAll(
                                " ",
                                "-"
                              )
                          }`}
                          value={
                            drone.status ||
                            "Available"
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              drone.id,
                              e.target.value
                            )
                          }
                        >

                          <option value="Available">
                            Available
                          </option>

                          <option value="In Flight">
                            In Flight
                          </option>

                          <option value="Charging">
                            Charging
                          </option>

                          <option value="Maintenance">
                            Maintenance
                          </option>

                        </select>

                      </td>


                      {/* Battery */}

                      <td>

                        <div className="drone-battery-cell">

                          <div className="drone-battery-top">

                            <span>
                              Battery
                            </span>

                            <strong>
                              {battery}%
                            </strong>

                          </div>

                          <div className="drone-battery-bar">

                            <span
                              style={{
                                width: `${battery}%`,
                              }}
                            ></span>

                          </div>

                        </div>

                      </td>


                      {/* Location */}

                      <td>

                        <div className="drone-location">

                          📍{" "}
                          {drone.location ||
                            "—"}

                        </div>

                      </td>


                      {/* ETA */}

                      <td>
                        {drone.eta || "—"}
                      </td>


                      {/* Actions */}

                      <td>

                        <div className="drone-actions">

                          <button
                            type="button"
                            className="drone-edit-btn"
                            onClick={() =>
                              handleEditDrone(
                                drone
                              )
                            }
                            title="Edit Drone"
                          >
                            ✏️
                          </button>

                          <button
                            type="button"
                            className="drone-delete-btn"
                            onClick={() =>
                              handleDelete(
                                drone.id
                              )
                            }
                            title="Delete Drone"
                          >
                            🗑️
                          </button>

                        </div>

                      </td>

                    </tr>

                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminDrones;
