/* File: js/trips.js */
import { database } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Example: we might store trips in "trips" node in DB
const tripsRef = ref(database, "trips");
const tripListEl = document.getElementById("tripList");

onValue(tripsRef, (snapshot) => {
  const data = snapshot.val();
  tripListEl.innerHTML = "";

  if (!data) {
    tripListEl.innerHTML = "<p>No trips scheduled.</p>";
    return;
  }

  // Build a table or list
  let html = `
    <table class="table">
      <thead>
        <tr>
          <th>Trip ID</th>
          <th>Vehicle</th>
          <th>Driver</th>
          <th>Start Date</th>
          <th>End Date</th>
        </tr>
      </thead>
      <tbody>
  `;

  Object.keys(data).forEach((tripId) => {
    const trip = data[tripId];
    html += `
      <tr>
        <td>${tripId}</td>
        <td>${trip.vehicle || "N/A"}</td>
        <td>${trip.driver || "N/A"}</td>
        <td>${trip.startDate || "N/A"}</td>
        <td>${trip.endDate || "N/A"}</td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  tripListEl.innerHTML = html;
});
