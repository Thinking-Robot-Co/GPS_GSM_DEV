import { database } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Firebase References
const vehiclesRef = ref(database, "vehicles");
const tripsRef = ref(database, "trips");

// Get HTML Elements
const vehicleSelect = document.getElementById("vehicleSelect");
const mapDiv = document.getElementById("map");

// Initialize Map
const map = L.map("map").setView([20.5937, 78.9629], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Store Markers & Routes
let markers = {};
let routeLayer;

// Load Vehicles for Selection
onValue(vehiclesRef, (snapshot) => {
  vehicleSelect.innerHTML = "<option value=''>Select a Vehicle</option>";

  if (!snapshot.exists()) return;
  const vehicles = snapshot.val();

  Object.keys(vehicles).forEach(vehicleId => {
    vehicleSelect.innerHTML += `<option value="${vehicleId}">${vehicleId}</option>`;
  });
});

// Handle Vehicle Selection
vehicleSelect.addEventListener("change", () => {
  const selectedVehicle = vehicleSelect.value;
  if (!selectedVehicle) return;

  // Load Vehicle Data
  onValue(ref(database, `vehicles/${selectedVehicle}`), (snapshot) => {
    if (!snapshot.exists()) return;
    const vehicle = snapshot.val();

    // Clear old markers
    Object.keys(markers).forEach(id => map.removeLayer(markers[id]));

    // Place Marker for Current Location
    if (vehicle.gps) {
      const marker = L.marker([vehicle.gps.latitude, vehicle.gps.longitude]).addTo(map)
        .bindPopup(`<b>Vehicle:</b> ${selectedVehicle}<br><b>Location:</b> ${vehicle.gps.latitude}, ${vehicle.gps.longitude}`);
      markers[selectedVehicle] = marker;
    }

    // Check for Trip & Show Route
    onValue(ref(database, `trips/${selectedVehicle}`), (tripSnapshot) => {
      if (!tripSnapshot.exists()) return;
      const trip = tripSnapshot.val();

      if (routeLayer) map.removeLayer(routeLayer);
      routeLayer = L.polyline([[trip.startLat, trip.startLng], [trip.endLat, trip.endLng]], {
        color: "blue",
        weight: 5
      }).addTo(map);
    });
  });
});

// Generate Random Sensor Data for Testing
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

// Chart.js Graphs
const fuelChart = new Chart(document.getElementById("fuelChart"), {
  type: "line",
  data: { labels: [], datasets: [{ label: "Fuel Level (%)", data: [] }] }
});
const speedChart = new Chart(document.getElementById("speedChart"), {
  type: "line",
  data: { labels: [], datasets: [{ label: "Speed (km/h)", data: [] }] }
});
const temperatureChart = new Chart(document.getElementById("temperatureChart"), {
  type: "line",
  data: { labels: [], datasets: [{ label: "Temperature (°C)", data: [] }] }
});
const batteryChart = new Chart(document.getElementById("batteryChart"), {
  type: "line",
  data: { labels: [], datasets: [{ label: "Battery Voltage (V)", data: [] }] }
});

// Simulate Sensor Data Updates Every 5 Seconds
setInterval(() => {
  fuelChart.data.datasets[0].data.push(getRandom(20, 100));
  speedChart.data.datasets[0].data.push(getRandom(10, 120));
  temperatureChart.data.datasets[0].data.push(getRandom(15, 50));
  batteryChart.data.datasets[0].data.push(getRandom(11, 14));
  
  fuelChart.update();
  speedChart.update();
  temperatureChart.update();
  batteryChart.update();
}, 5000);
