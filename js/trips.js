import { database } from "./firebase.js";
import { ref, onValue, push, set, remove } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Fix Tab Switching Issue
document.addEventListener("DOMContentLoaded", function () {
  const tabLinks = document.querySelectorAll(".trip-tab");
  const liveTripsSection = document.getElementById("liveTripsSection");
  const upcomingTripsSection = document.getElementById("upcomingTripsSection");
  const scheduleTripSection = document.getElementById("scheduleTripSection");

  tabLinks.forEach((tab) => {
    tab.addEventListener("click", function (event) {
      event.preventDefault();

      // Remove active class from all tabs
      tabLinks.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Hide all sections
      liveTripsSection.classList.add("d-none");
      upcomingTripsSection.classList.add("d-none");
      scheduleTripSection.classList.add("d-none");

      // Show the selected section
      if (this.id === "liveTripsTab") liveTripsSection.classList.remove("d-none");
      if (this.id === "upcomingTripsTab") upcomingTripsSection.classList.remove("d-none");
      if (this.id === "scheduleTripTab") scheduleTripSection.classList.remove("d-none");
    });
  });
});

// Load Available Vehicles
const vehicleSelect = document.getElementById("vehicleSelect");
const vehiclesRef = ref(database, "vehicles");

onValue(vehiclesRef, (snapshot) => {
  vehicleSelect.innerHTML = "";
  if (!snapshot.exists()) return;

  const vehicles = snapshot.val();
  Object.keys(vehicles).forEach(vehicleId => {
    if (!vehicles[vehicleId].tripAssigned) {
      vehicleSelect.innerHTML += `<option value="${vehicleId}">${vehicleId}</option>`;
    }
  });
});

// Schedule Trip
document.getElementById("scheduleTripForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const newTripRef = push(ref(database, "trips"));
  set(newTripRef, {
    start: document.getElementById("startLocation").value,
    destination: document.getElementById("destination").value,
    date: document.getElementById("tripDate").value,
    vehicle: vehicleSelect.value,
  });

  alert("Trip Scheduled Successfully!");
  document.getElementById("scheduleTripForm").reset();
});

// Load Live & Upcoming Trips
const upcomingTripsList = document.getElementById("upcomingTripsList");
const tripsRef = ref(database, "trips");

onValue(tripsRef, (snapshot) => {
  upcomingTripsList.innerHTML = "<h5>No Upcoming Trips</h5>";

  if (!snapshot.exists()) return;
  const trips = snapshot.val();

  Object.keys(trips).forEach(tripId => {
    const trip = trips[tripId];
    upcomingTripsList.innerHTML += `
      <div class="card p-3 mb-2">
        <h5>Trip: ${tripId}</h5>
        <p><strong>Vehicle:</strong> ${trip.vehicle}</p>
        <p><strong>From:</strong> ${trip.start} → <strong>To:</strong> ${trip.destination}</p>
        <p><strong>Date:</strong> ${trip.date}</p>
        <button class="btn btn-danger cancel-trip" data-trip="${tripId}">Cancel Trip</button>
      </div>`;
  });

  document.querySelectorAll(".cancel-trip").forEach(button => {
    button.addEventListener("click", function () {
      const tripId = this.dataset.trip;
      remove(ref(database, `trips/${tripId}`)).then(() => {
        alert("Trip canceled successfully!");
      });
    });
  });
});
