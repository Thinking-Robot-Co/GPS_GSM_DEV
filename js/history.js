/* File: js/history.js */
import { database } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Suppose "history" node in DB
const historyRef = ref(database, "history");
const historyContainer = document.getElementById("historyContainer");

onValue(historyRef, (snapshot) => {
  const data = snapshot.val();
  historyContainer.innerHTML = "";

  if (!data) {
    historyContainer.innerHTML = "<p>No history data found.</p>";
    return;
  }

  let html = `<div class="list-group">`;
  Object.keys(data).forEach((histKey) => {
    const record = data[histKey];
    html += `
      <div class="list-group-item">
        <h5>${record.vehicle || "Unknown Vehicle"} - ${record.date || "Unknown Date"}</h5>
        <p><strong>Tasks:</strong> ${record.tasks || "N/A"}</p>
        <p><strong>Cost:</strong> $${record.cost || 0}</p>
      </div>
    `;
  });
  html += `</div>`;

  historyContainer.innerHTML = html;
});
