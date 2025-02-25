/* File: js/index.js */
import { database } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Suppose we have "vehicles" data in DB
const vehiclesRef = ref(database, "vehicles");

// Example real-time listener for "vehicles"
onValue(vehiclesRef, (snapshot) => {
  const vehiclesData = snapshot.val() || {};

  // 1. Total vehicles
  const totalVehicles = Object.keys(vehiclesData).length;

  // 2. Vehicles Available / En Route
  // For simplicity, let's assume if "fuelLevel" > 50 => "Available", else "En Route" 
  // (You can define your own logic based on the data.)
  let vehiclesAvailable = 0;
  let vehiclesEnRoute = 0;

  Object.keys(vehiclesData).forEach((vehicleKey) => {
    const v = vehiclesData[vehicleKey];
    if (v.fuelLevel > 50) {
      vehiclesAvailable++;
    } else {
      vehiclesEnRoute++;
    }
  });

  // 3. Maintenance Alerts
  // For example, if "tireChange" == true => consider it an alert
  let maintenanceAlerts = 0;
  Object.keys(vehiclesData).forEach((vehicleKey) => {
    if (vehiclesData[vehicleKey].tireChange === true) {
      maintenanceAlerts++;
    }
  });

  // Update DOM
  document.getElementById("totalVehicles").textContent = totalVehicles;
  document.getElementById("vehiclesAvailable").textContent = vehiclesAvailable;
  document.getElementById("vehiclesEnRoute").textContent = vehiclesEnRoute;
  document.getElementById("maintenanceAlerts").textContent = maintenanceAlerts;
});
