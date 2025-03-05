import { database } from "./firebase.js";
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Firebase References
const vehiclesRef = ref(database, "vehicles");
const tripsRef = ref(database, "trips");

// Get Elements
const totalVehiclesEl = document.getElementById("totalVehicles");
const vehiclesAvailableEl = document.getElementById("vehiclesAvailable");
const vehiclesEnRouteEl = document.getElementById("vehiclesEnRoute");

// Initialize Map
let map;
let markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 20.5937, lng: 78.9629 }, // Default to India
    zoom: 5
  });
}

// Load Vehicles Data
onValue(vehiclesRef, (snapshot) => {
  const vehicles = snapshot.val() || {};
  const totalVehicles = Object.keys(vehicles).length;
  let availableVehicles = totalVehicles;
  let vehiclesEnRoute = 0;

  // Clear old markers
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  Object.keys(vehicles).forEach((vehicleId) => {
    const vehicle = vehicles[vehicleId];

    // Check if vehicle is on a live trip
    if (vehicle.tripAssigned) {
      vehiclesEnRoute++;
      availableVehicles--;
    }

    // Place marker on map
    if (vehicle.gps) {
      const marker = new google.maps.Marker({
        position: { lat: vehicle.gps.latitude, lng: vehicle.gps.longitude },
        map: map,
        title: `Vehicle: ${vehicleId}`
      });

      // Show info when hovered
      const infoWindow = new google.maps.InfoWindow({
        content: `<strong>Vehicle:</strong> ${vehicleId}<br><strong>Location:</strong> ${vehicle.gps.latitude}, ${vehicle.gps.longitude}`
      });

      marker.addListener("mouseover", () => infoWindow.open(map, marker));
      marker.addListener("mouseout", () => infoWindow.close());

      markers.push(marker);
    }
  });

  // Update DOM
  totalVehiclesEl.textContent = totalVehicles;
  vehiclesAvailableEl.textContent = availableVehicles;
  vehiclesEnRouteEl.textContent = vehiclesEnRoute;
});

// Auto-move Scheduled Trips to Live Trips
onValue(tripsRef, (snapshot) => {
  if (!snapshot.exists()) return;
  const trips = snapshot.val();
  const today = new Date().toISOString().split("T")[0];

  Object.keys(trips).forEach((tripId) => {
    const trip = trips[tripId];

    if (trip.date === today) {
      update(ref(database, `vehicles/${trip.vehicle}`), { tripAssigned: true });
      update(ref(database, `trips/${tripId}`), { status: "live" });
    }
  });
});

// Initialize the map
window.onload = initMap;
