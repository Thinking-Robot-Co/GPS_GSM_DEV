import { database } from "./firebase.js";
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Firebase References
const vehiclesRef = ref(database, "vehicles");
const tripsRef = ref(database, "trips");

// Get Elements
const totalVehiclesEl = document.getElementById("totalVehicles");
const vehiclesAvailableEl = document.getElementById("vehiclesAvailable");
const vehiclesEnRouteEl = document.getElementById("vehiclesEnRoute");

// Wait for the window to load before initializing the map
document.addEventListener("DOMContentLoaded", function () {
    const map = L.map("map").setView([20.5937, 78.9629], 5); // Default to India

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    // Track vehicle markers
    let markers = {};

    // Load Vehicles Data
    onValue(vehiclesRef, (snapshot) => {
        const vehicles = snapshot.val() || {};
        const totalVehicles = Object.keys(vehicles).length;
        let availableVehicles = totalVehicles;
        let vehiclesEnRoute = 0;

        // Clear old markers
        Object.keys(markers).forEach((id) => {
            map.removeLayer(markers[id]);
        });

        Object.keys(vehicles).forEach((vehicleId) => {
            const vehicle = vehicles[vehicleId];

            // Check if vehicle is on a live trip
            if (vehicle.tripAssigned) {
                vehiclesEnRoute++;
                availableVehicles--;
            }

            // Place marker on map
            if (vehicle.gps) {
                const marker = L.marker([vehicle.gps.latitude, vehicle.gps.longitude]).addTo(map)
                    .bindPopup(`<b>Vehicle:</b> ${vehicleId}<br><b>Location:</b> ${vehicle.gps.latitude}, ${vehicle.gps.longitude}`);

                markers[vehicleId] = marker;
            }
        });

        // Update dashboard values
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
});
