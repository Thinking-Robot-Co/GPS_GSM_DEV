import { database } from "./firebase.js";
import { ref, onValue, push, set } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

const liveTripsTab = document.getElementById("liveTripsTab");
const upcomingTripsTab = document.getElementById("upcomingTripsTab");
const scheduleTripTab = document.getElementById("scheduleTripTab");

const liveTripsSection = document.getElementById("liveTripsSection");
const upcomingTripsSection = document.getElementById("upcomingTripsSection");
const scheduleTripSection = document.getElementById("scheduleTripSection");

const liveTripsList = document.getElementById("liveTripsList");
const upcomingTripsList = document.getElementById("upcomingTripsList");

const scheduleTripForm = document.getElementById("scheduleTripForm");
const tripDateInput = document.getElementById("tripDate");
const vehicleSelect = document.getElementById("vehicleSelect");

// Switch Tabs
liveTripsTab.addEventListener("click", () => showSection(liveTripsSection));
upcomingTripsTab.addEventListener("click", () => showSection(upcomingTripsSection));
scheduleTripTab.addEventListener("click", () => showSection(scheduleTripSection));

function showSection(section) {
  liveTripsSection.classList.add("d-none");
  upcomingTripsSection.classList.add("d-none");
  scheduleTripSection.classList.add("d-none");
  section.classList.remove("d-none");
}

// Load Live Trips
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
const today = new Date().toISOString().split("T")[0];
tripDateInput.setAttribute("min", today);

// Load Available Vehicles
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
scheduleTripForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newTripRef = push(ref(database, "trips"));
  set(newTripRef, {
    start: document.getElementById("startLocation").value,
    destination: document.getElementById("destination").value,
    date: tripDateInput.value,
    vehicle: vehicleSelect.value,
  });

  alert("Trip Scheduled Successfully!");
  scheduleTripForm.reset();
});
