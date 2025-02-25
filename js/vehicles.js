/* File: js/vehicles.js */
import { database } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

const vehiclesRef = ref(database, "vehicles");
const vehiclesContainer = document.getElementById("vehiclesContainer");

onValue(vehiclesRef, (snapshot) => {
  const data = snapshot.val();
  vehiclesContainer.innerHTML = ""; // clear old content

  if (!data) {
    vehiclesContainer.innerHTML = "<p>No vehicle data available.</p>";
    return;
  }

  Object.keys(data).forEach((vehicleKey) => {
    const v = data[vehicleKey];
    const lat = v.gps?.latitude ?? "N/A";
    const lng = v.gps?.longitude ?? "N/A";
    const fuelLevel = v.fuelLevel ?? 0;
    const batteryVoltage = v.batteryVoltage ?? 0;
    const engineSpeed = v.engineSpeed ?? 0;
    const temperature = v.temperature ?? 0;
    const tireChange = v.tireChange ? "Yes" : "No";
    const tripsPerformed = v.tripsPerformed ?? 0;
    const totalTripTime = v.totalTripTime ?? 0;

    // Convert totalTripTime (seconds) to HH:MM:SS
    const hours = Math.floor(totalTripTime / 3600);
    const minutes = Math.floor((totalTripTime % 3600) / 60);
    const seconds = totalTripTime % 60;
    const formattedTime = `${hours}h ${minutes}m ${seconds}s`;

    // Build a card
    const card = document.createElement("div");
    card.classList.add("col-md-6", "col-lg-4", "vehicle-card");
    card.innerHTML = `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${vehicleKey.toUpperCase()}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Trip ID: ${v.tripID ?? "N/A"}</h6>

          <p><strong>Location:</strong> ${lat}, ${lng}</p>

          <p><strong>Fuel Level:</strong> ${fuelLevel}%</p>
          <div class="progress mb-2">
            <div 
              class="progress-bar bg-success" 
              role="progressbar" 
              style="width: ${fuelLevel}%" 
              aria-valuenow="${fuelLevel}" 
              aria-valuemin="0" 
              aria-valuemax="100">
            </div>
          </div>

          <p><strong>Battery Voltage:</strong> ${batteryVoltage} V</p>
          <p><strong>Engine Speed:</strong> ${engineSpeed} RPM</p>
          <p><strong>Temperature:</strong> ${temperature} °C</p>
          <p><strong>Tire Change Needed:</strong> ${tireChange}</p>
          <p><strong>Trips Performed:</strong> ${tripsPerformed}</p>
          <p><strong>Total Trip Time:</strong> ${formattedTime}</p>
        </div>
      </div>
    `;
    vehiclesContainer.appendChild(card);
  });
});
