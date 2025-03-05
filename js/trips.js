import { database } from "./firebase.js";
import { ref, onValue, push, set } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

const tabLinks = document.querySelectorAll(".nav-link");

// Sections
const liveTripsSection = document.getElementById("liveTripsSection");
const upcomingTripsSection = document.getElementById("upcomingTripsSection");
const scheduleTripSection = document.getElementById("scheduleTripSection");

// Tab Switching Logic
tabLinks.forEach((tab) => {
  tab.addEventListener("click", function (event) {
    event.preventDefault();

    tabLinks.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");

    liveTripsSection.classList.add("d-none");
    upcomingTripsSection.classList.add("d-none");
    scheduleTripSection.classList.add("d-none");

    if (this.id === "liveTripsTab") liveTripsSection.classList.remove("d-none");
    else if (this.id === "upcomingTripsTab") upcomingTripsSection.classList.remove("d-none");
    else if (this.id === "scheduleTripTab") scheduleTripSection.classList.remove("d-none");
  });
});

// Load Live & Upcoming Trips
const liveTripsList = document.getElementById("liveTripsList");
const upcomingTripsList = document.getElementById("upcomingTripsList");

onValue(ref(database, "trips"), (snapshot) => {
  liveTripsList.innerHTML = "<h5>No Live Trips</h5>";
  upcomingTripsList.innerHTML = "<h5>No Upcoming Trips</h5>";

  if (!snapshot.exists()) return;

  const trips = snapshot.val();
  Object.keys(trips).forEach((tripId) => {
    const trip = trips[tripId];
    const tripHtml = `
      <div class="card p-3 mb-2">
        <h5>Trip: ${tripId}</h5>
        <p><strong>Vehicle:</strong> ${trip.vehicle}</p>
        <p><strong>From:</strong> ${trip.start} → <strong>To:</strong> ${trip.destination}</p>
        <p><strong>Date:</strong> ${trip.date}</p>
      </div>`;

    if (new Date(trip.date) > new Date()) {
      upcomingTripsList.innerHTML += tripHtml;
    } else {
      liveTripsList.innerHTML += tripHtml;
    }
  });
});

// Prevent Past Dates
const tripDateInput = document.getElementById("tripDate");
const today = new Date().toISOString().split("T")[0];
tripDateInput.setAttribute("min", today);

// Load Available Vehicles
const vehicleSelect = document.getElementById("vehicleSelect");

onValue(ref(database, "vehicles"), (snapshot) => {
  vehicleSelect.innerHTML = "";
  if (!snapshot.exists()) return;
  const vehicles = snapshot.val();

  Object.keys(vehicles).forEach((vehicleId) => {
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
    date: tripDateInput.value,
    vehicle: vehicleSelect.value,
  });

  alert("Trip Scheduled Successfully!");
  document.getElementById("scheduleTripForm").reset();
});
