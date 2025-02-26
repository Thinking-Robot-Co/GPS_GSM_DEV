// File: js/admin.js
import { database } from "./firebase.js";
import { ref, set, update, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Handle vehicle creation
const createVehicleForm = document.getElementById("createVehicleForm");
createVehicleForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  // Gather form inputs
  const vehicleId = document.getElementById("vehicleId").value.trim();
  const vehicleModel = document.getElementById("vehicleModel").value.trim();
  const manufacturer = document.getElementById("manufacturer").value.trim();
  const year = document.getElementById("year").value;
  const driverId = document.getElementById("driverId").value.trim();
  const latitude = parseFloat(document.getElementById("latitude").value);
  const longitude = parseFloat(document.getElementById("longitude").value);
  const fuelLevel = parseFloat(document.getElementById("fuelLevel").value);
  const batteryVoltage = parseFloat(document.getElementById("batteryVoltage").value);
  const vehicleLoad = parseFloat(document.getElementById("vehicleLoad").value) || 0;
  const engineSpeed = parseFloat(document.getElementById("engineSpeed").value) || 0;
  const temperature = parseFloat(document.getElementById("temperature").value) || 0;
  const tirePressureFrontLeft = parseFloat(document.getElementById("tirePressureFrontLeft").value) || 0;
  const tirePressureFrontRight = parseFloat(document.getElementById("tirePressureFrontRight").value) || 0;
  const tirePressureRearLeft = parseFloat(document.getElementById("tirePressureRearLeft").value) || 0;
  const tirePressureRearRight = parseFloat(document.getElementById("tirePressureRearRight").value) || 0;
  const tireTempFrontLeft = parseFloat(document.getElementById("tireTempFrontLeft").value) || 0;
  const tireTempFrontRight = parseFloat(document.getElementById("tireTempFrontRight").value) || 0;
  const tireTempRearLeft = parseFloat(document.getElementById("tireTempRearLeft").value) || 0;
  const tireTempRearRight = parseFloat(document.getElementById("tireTempRearRight").value) || 0;
  const odometer = parseFloat(document.getElementById("odometer").value) || 0;
  const engineHours = parseFloat(document.getElementById("engineHours").value) || 0;
  const oilPressure = parseFloat(document.getElementById("oilPressure").value) || 0;
  const tripsPerformed = parseInt(document.getElementById("tripsPerformed").value) || 0;
  const totalTripTime = parseInt(document.getElementById("totalTripTime").value) || 0;
  const tripID = document.getElementById("tripID").value.trim();
  const nextMaintenanceDate = document.getElementById("nextMaintenanceDate").value;
  const tireChange = document.getElementById("tireChange").checked;
  
  // Build vehicle data object
  const vehicleData = {
    vehicleModel,
    manufacturer,
    year,
    driverId,
    gps: {
      latitude,
      longitude
    },
    fuelLevel,
    batteryVoltage,
    vehicleLoad,
    engineSpeed,
    temperature,
    tirePressure: {
      front_left: tirePressureFrontLeft,
      front_right: tirePressureFrontRight,
      rear_left: tirePressureRearLeft,
      rear_right: tirePressureRearRight
    },
    tireTemperature: {
      front_left: tireTempFrontLeft,
      front_right: tireTempFrontRight,
      rear_left: tireTempRearLeft,
      rear_right: tireTempRearRight
    },
    odometer,
    engineHours,
    oilPressure,
    tripsPerformed,
    totalTripTime,
    tripID,
    nextMaintenanceDate,
    tireChange
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
    
    // For each vehicle, simulate random updates
    Object.keys(vehicles).forEach((vehicleId) => {
      const currentData = vehicles[vehicleId];
      
      // Random updates: decrease fuel by 1-5%, adjust GPS slightly
      const newFuelLevel = Math.max(0, currentData.fuelLevel - (Math.floor(Math.random() * 5) + 1));
      const newLatitude = currentData.gps.latitude + (Math.random() * 0.001 - 0.0005);
      const newLongitude = currentData.gps.longitude + (Math.random() * 0.001 - 0.0005);
      
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
