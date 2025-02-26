// File: js/admin.js
import { database } from "./firebase.js";
import { ref, set, update, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Handle vehicle creation
const createVehicleForm = document.getElementById("createVehicleForm");
createVehicleForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  // Gather form inputs
  const vehicleId = document.getElementById("vehicleId").value.trim();
  const latitude = parseFloat(document.getElementById("latitude").value);
  const longitude = parseFloat(document.getElementById("longitude").value);
  const fuelLevel = parseFloat(document.getElementById("fuelLevel").value);
  
  // Set default values for additional parameters
  const vehicleData = {
    gps: {
      latitude: latitude,
      longitude: longitude
    },
    fuelLevel: fuelLevel,
    batteryVoltage: 12.0,
    vehicleLoad: 1000,
    engineSpeed: 2000,
    temperature: 80,
    tirePressure: {
      front_left: 32,
      front_right: 32,
      rear_left: 30,
      rear_right: 30
    },
    tireChange: false,
    tripsPerformed: 0,
    totalTripTime: 0,
    tripID: "N/A"
  };
  
  // Create a new node under /vehicles/<vehicleId>
  const vehicleRef = ref(database, "vehicles/" + vehicleId);
  set(vehicleRef, vehicleData)
    .then(() => {
      alert("Vehicle created successfully!");
      createVehicleForm.reset();
    })
    .catch((error) => {
      alert("Error creating vehicle: " + error);
    });
});

// Simulation: Update all vehicles with random changes
const simulateUpdateBtn = document.getElementById("simulateUpdateBtn");
simulateUpdateBtn.addEventListener("click", () => {
  const vehiclesRef = ref(database, "vehicles");
  
  // Retrieve current vehicle data once
  onValue(vehiclesRef, (snapshot) => {
    const vehicles = snapshot.val();
    if (!vehicles) {
      document.getElementById("simulationStatus").textContent = "No vehicles found for simulation.";
      return;
    }
    
    // For each vehicle, simulate a random change
    Object.keys(vehicles).forEach((vehicleId) => {
      const currentData = vehicles[vehicleId];
      
      // Simulate a random fuel drop (1-5%) and minor GPS changes
      const newFuelLevel = Math.max(0, currentData.fuelLevel - (Math.floor(Math.random() * 5) + 1));
      const newLatitude = currentData.gps.latitude + (Math.random() * 0.001 - 0.0005);
      const newLongitude = currentData.gps.longitude + (Math.random() * 0.001 - 0.0005);
      
      // Update the vehicle data
      const vehicleRefUpdate = ref(database, "vehicles/" + vehicleId);
      update(vehicleRefUpdate, {
        fuelLevel: newFuelLevel,
        "gps/latitude": newLatitude,
        "gps/longitude": newLongitude
      });
    });
    
    document.getElementById("simulationStatus").textContent = "Simulation update applied.";
  }, { onlyOnce: true });
});
