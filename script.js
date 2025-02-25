// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    databaseURL: "https://your-project-id.firebaseio.com/",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Initialize Map
function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: { lat: 18.5204, lng: 73.8567 }, // Default Pune location
    });

    const marker = new google.maps.Marker({
        position: { lat: 18.5204, lng: 73.8567 },
        map: map,
        title: "Truck Location"
    });

    // Listen for updates in Firebase
    database.ref("trucks/truck_01").on("value", (snapshot) => {
        const data = snapshot.val();
        if (data) {
            marker.setPosition({ lat: data.latitude, lng: data.longitude });
            map.setCenter({ lat: data.latitude, lng: data.longitude });
        }
    });
}

// Load Google Maps
function loadGoogleMaps() {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap`;
    script.async = true;
    document.body.appendChild(script);
}

loadGoogleMaps();
