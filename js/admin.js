// File: js/admin.js
import { database } from "./firebase.js";
import { ref, set, update, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Handle vehicle creation
const createVehicleForm = document.getElementById("createVehicleForm");
createVehicleForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  // Gather form inputs
  const vehicleId         = document.getElementById("vehicleId").value.trim();
  const driverName        = document.getElementById("driverName").value.trim();
  const driverId          = document.getElementById("driverId").value.trim();
  const latitude          = parseFloat(document.getElementById("latitude").value);
  const longitude         = parseFloat(document.getElementById("longitude").value);
  const gpsTimestamp      = document.getElementById("gpsTimestamp").value; // ISO string from datetime-local
  const fuelLevel         = parseFloat(document.getElementById("fuelLevel").value);
  const batteryVoltage    = parseFloat(document.getElementById("batteryVoltage").value);
  const vehicleLoad       = parseFloat(document.getElementById("vehicleLoad").value);
  const odometer          = parseFloat(document.getElementById("odometer").value);
  const engineSpeed       = parseFloat(document.getElementById("engineSpeed").value);
  const currentSpeed      = parseFloat(document.getElementById("currentSpeed").value);
  const engineHours       = parseFloat(document.getElementById("engineHours").value);
  const fuelConsumption   = parseFloat(document.getElementById("fuelConsumption").value);
  const temperature       = parseFloat(document.getElementById("temperature").value);
  const oilPressure       = parseFloat(document.getElementById("oilPressure").value);
  const coolantTemp       = parseFloat(document.getElementById("coolantTemp").value);
  const batteryHealth     = parseFloat(document.getElementById("batteryHealth").value);
  
  // Tire pressures
  const tirePressureFL    = parseFloat(document.getElementById("tirePressureFL").value);
  const tirePressureFR    = parseFloat(document.getElementById("tirePressureFR").value);
  const tirePressureRL    = parseFloat(document.getElementById("tirePressureRL").value);
  const tirePressureRR    = parseFloat(document.getElementById("tirePressureRR").value);
  
  // Tire temperatures
  const tireTempFL        = parseFloat(document.getElementById("tireTempFL").value);
  const tireTempFR        = parseFloat(document.getElementById("tireTempFR").value);
  const tireTempRL        = parseFloat(document.getElementById("tireTempRL").value);
  const tireTempRR        = parseFloat(document.getElementById("tireTempRR").value);
  
  // Other operational data
  const tripsPerformed    = parseInt(document.getElementById("tripsPerformed").value, 10);
  const totalTripTime     = parseInt(document.getElementById("totalTripTime").value, 10);
  const tripID            = document.getElementById("tripID").value.trim();
  
  // Maintenance info
  const lastServiceDate      = document.getElementById("lastServiceDate").value;
  const nextMaintenanceDate  = document.getElementById("nextMaintenanceDate").value;
  
  // Construct the vehicle data object
  const vehicleData = {
    driver: {
      name: driverName,
      id: driverId
    },
    gps: {
      latitude: latitude,
      longitude: longitude,
      timestamp: gpsTimestamp || new Date().toISOString()
    },
    fuelLevel: fuelLevel,
    batteryVoltage: batteryVoltage,
    batteryHealth: batteryHealth,
    vehicleLoad: vehicleLoad,
    odometer: odometer,
    engineSpeed: engineSpeed,
    currentSpeed: currentSpeed,
    engineHours: engineHours,
    fuelConsumption: fuelConsumption,
    temperature: temperature,
    oilPressure: oilPressure,
    coolantTemp: coolantTemp,
    tirePressure: {
      front_left: tirePressureFL,
      front_right: tirePressureFR,
      rear_left: tirePressureRL,
      rear_right: tirePressureRR
    },
    tireTemperature: {
      front_left: tireTempFL,
      front_right: tireTempFR,
      rear_left: tireTempRL,
      rear_right: tireTempRR
    },
    tripsPerformed: tripsPerformed,
    totalTripTime: totalTripTime,
    tripID: tripID,
    maintenance: {
      lastServiceDate: lastServiceDate,
      nextMaintenanceDate: nextMaintenanceDate
    }
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
    
    // For each vehicle, simulate random changes
    Object.keys(vehicles).forEach((vehicleId) => {
      const currentData = vehicles[vehicleId];
      
      // Simulate random variations
      const newFuelLevel = Math.max(0, currentData.fuelLevel - (Math.floor(Math.random() * 5) + 1));
      const newLatitude = currentData.gps.latitude + (Math.random() * 0.001 - 0.0005);
      const newLongitude = currentData.gps.longitude + (Math.random() * 0.001 - 0.0005);
      const newOdometer = currentData.odometer + (Math.random() * 2);
      
      // Update the vehicle data
      const vehicleRefUpdate = ref(database, "vehicles/" + vehicleId);
      update(vehicleRefUpdate, {
        fuelLevel: newFuelLevel,
        "gps/latitude": newLatitude,
        "gps/longitude": newLongitude,
        odometer: newOdometer
      });
    });
    
    document.getElementById("simulationStatus").textContent = "Simulation update applied.";
  }, { onlyOnce: true });
});
