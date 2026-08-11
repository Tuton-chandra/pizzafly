const DRONES_KEY = "pizzafly_drones";

// =====================================================
// DEFAULT DRONES
// =====================================================

const defaultDrones = [
  {
    id: "PF-101",
    name: "PizzaFly Drone 101",
    status: "Available",
    battery: 96,
    location: "PizzaFly HQ",
    eta: "—",
  },
  {
    id: "PF-102",
    name: "PizzaFly Drone 102",
    status: "In Flight",
    battery: 72,
    location: "Dhanmondi",
    eta: "03:24",
  },
  {
    id: "PF-103",
    name: "PizzaFly Drone 103",
    status: "Charging",
    battery: 34,
    location: "Charging Station",
    eta: "18 min",
  },
  {
    id: "PF-104",
    name: "PizzaFly Drone 104",
    status: "In Flight",
    battery: 81,
    location: "Gulshan",
    eta: "05:12",
  },
];

// =====================================================
// GET ALL DRONES
// =====================================================

export const getDrones = () => {
  try {
    const saved = localStorage.getItem(DRONES_KEY);

    if (saved) {
      return JSON.parse(saved);
    }

    localStorage.setItem(
      DRONES_KEY,
      JSON.stringify(defaultDrones)
    );

    return defaultDrones;
  } catch (error) {
    console.error(
      "Failed to load drones:",
      error
    );

    return [];
  }
};

// =====================================================
// SAVE DRONES
// =====================================================

export const saveDrones = (drones) => {
  try {
    localStorage.setItem(
      DRONES_KEY,
      JSON.stringify(drones)
    );

    return true;
  } catch (error) {
    console.error(
      "Failed to save drones:",
      error
    );

    return false;
  }
};

// =====================================================
// ADD DRONE
// =====================================================

export const addDrone = (drone) => {
  const drones = getDrones();

  const newDrone = {
    ...drone,

    id: `PF-${Date.now()}`,

    name:
      drone.name ||
      "PizzaFly Drone",

    status:
      drone.status ||
      "Available",

    battery:
      Number(drone.battery) || 100,

    location:
      drone.location ||
      "PizzaFly HQ",

    eta:
      drone.eta ||
      "—",
  };

  const updatedDrones = [
    ...drones,
    newDrone,
  ];

  saveDrones(updatedDrones);

  window.dispatchEvent(
    new Event("dronesUpdated")
  );

  return newDrone;
};

// =====================================================
// UPDATE DRONE
// =====================================================

export const updateDrone = (
  droneId,
  updatedData
) => {
  const drones = getDrones();

  const updatedDrones = drones.map(
    (drone) =>
      drone.id === droneId
        ? {
            ...drone,
            ...updatedData,
            battery:
              Number(
                updatedData.battery ??
                  drone.battery
              ),
          }
        : drone
  );

  saveDrones(updatedDrones);

  window.dispatchEvent(
    new Event("dronesUpdated")
  );

  return updatedDrones;
};

// =====================================================
// DELETE DRONE
// =====================================================

export const deleteDrone = (droneId) => {
  const drones = getDrones();

  const updatedDrones =
    drones.filter(
      (drone) =>
        drone.id !== droneId
    );

  saveDrones(updatedDrones);

  window.dispatchEvent(
    new Event("dronesUpdated")
  );

  return updatedDrones;
};

// =====================================================
// UPDATE DRONE STATUS
// =====================================================

export const updateDroneStatus = (
  droneId,
  status
) => {
  const drones = getDrones();

  const updatedDrones = drones.map(
    (drone) =>
      drone.id === droneId
        ? {
            ...drone,
            status,
          }
        : drone
  );

  saveDrones(updatedDrones);

  window.dispatchEvent(
    new Event("dronesUpdated")
  );

  return updatedDrones;
};

// =====================================================
// UPDATE BATTERY
// =====================================================

export const updateDroneBattery = (
  droneId,
  battery
) => {
  const drones = getDrones();

  const updatedDrones = drones.map(
    (drone) =>
      drone.id === droneId
        ? {
            ...drone,
            battery: Number(battery),
          }
        : drone
  );

  saveDrones(updatedDrones);

  window.dispatchEvent(
    new Event("dronesUpdated")
  );

  return updatedDrones;
};

// =====================================================
// CLEAR ALL DRONES
// =====================================================

export const clearDrones = () => {
  localStorage.removeItem(DRONES_KEY);

  window.dispatchEvent(
    new Event("dronesUpdated")
  );
};