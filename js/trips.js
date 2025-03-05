import { database } from "./firebase.js";
import { ref, onValue, push, set, remove } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Fix Sidebar Navigation Issue
document.querySelectorAll(".nav-link").forEach(tab => {
  tab.addEventListener("click", function () {
    document.querySelectorAll(".nav-link").forEach(t => t.classList.remove("active"));
    this.classList.add("active");
  });
});

// Tab Switching Logic
document.querySelectorAll(".trip-tab").forEach(tab => {
  tab.addEventListener("click", function (event) {
    event.preventDefault();

    document.querySelectorAll(".trip-tab").forEach(t => t.classList.remove("active"));
    this.classList.add("active");

    document.getElementById("liveTripsSection").classList.add("d-none");
    document.getElementById("upcomingTripsSection").classList.add("d-none");
    document.getElementById("scheduleTripSection").classList.add("d-none");

    if (this.id === "liveTripsTab") document.getElementById("liveTripsSection").classList.remove("d-none");
    if (this.id === "upcomingTripsTab") document.getElementById("upcomingTripsSection").classList.remove("d-none");
    if (this.id === "scheduleTripTab") document.getElementById("scheduleTripSection").classList.remove("d-none");
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

// Load Trips
const upcomingTripsList = document.getElementById("upcomingTripsList");
const tripsRef = ref(database, "trips");

onValue(tripsRef, (snapshot) => {
  upcomingTripsList.innerHTML = "";

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
