/* File: js/maintenance.js */
import { database } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Suppose maintenance logs are under "maintenance" in DB
const maintenanceRef = ref(database, "maintenance");
const maintenanceContainer = document.getElementById("maintenanceContainer");

onValue(maintenanceRef, (snapshot) => {
  const data = snapshot.val();
  maintenanceContainer.innerHTML = "";

  if (!data) {
    maintenanceContainer.innerHTML = "<p>No maintenance records found.</p>";
    return;
  }

  let html = `
    <ul class="list-group">
  `;

  // Example structure: { "record1": {vehicle: "AB123", task: "Oil Change", cost: 50, date: "2025-01-01"} }
  Object.keys(data).forEach((key) => {
    const record = data[key];
    html += `
      <li class="list-group-item">
        <strong>Vehicle:</strong> ${record.vehicle}<br/>
        <strong>Task:</strong> ${record.task}<br/>
        <strong>Cost:</strong> $${record.cost}<br/>
        <strong>Date:</strong> ${record.date}
      </li>
    `;
  });

  html += `</ul>`;
  maintenanceContainer.innerHTML = html;
});
