let port, reader;

async function connectToArduino() {
  try {
    // Request a serial port connection
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    // Get a readable stream of data from the Arduino
    reader = port.readable.getReader(); // Lock the stream for reading
    readArduinoData();
  } catch (error) {
    console.error("Error connecting to Arduino:", error);
  }
}

async function readArduinoData() {
  const decoder = new TextDecoder("utf-8"); // Decode raw data into a string

  while (true) {
    try {
      const { value, done } = await reader.read(); // Read raw data
      if (done) {
        console.log("Stream closed.");
        break;
      }

      // Decode the raw data and trim whitespace
      const decodedValue = decoder.decode(value).trim();

      // Parse the received data (assuming it is "distance,light")
      if (decodedValue) {
        const [distance, light] = decodedValue.split(",").map(Number); // Convert to numbers
        updateDashboard(distance, light);
      }
    } catch (error) {
      console.error("Error reading from Arduino:", error);
      break;
    }
  }

  // Release the reader when done
  reader.releaseLock();
}

function updateDashboard(distance, light) {
  // Update Water Level Section
  const waterLevelElement = document.getElementById("waterLevel");
  const waterAlertElement = document.getElementById("waterLevelAlert");

  waterLevelElement.textContent = `${distance} cm`;

  if (distance < 10 || distance > 1000) {
    waterAlertElement.textContent = "WATER LEVEL HIGH";
    waterAlertElement.style.color = "red";
  } else if (distance > 30) {
    waterAlertElement.textContent = "WATER LEVEL LOW";
    waterAlertElement.style.color = "orange";
  } else {
    waterAlertElement.textContent = "WATER LEVEL NORMAL";
    waterAlertElement.style.color = "green";
  }

  // Update Turbidity Section
  const turbidityElement = document.getElementById("turbidityLevel");
  const turbidityAlertElement = document.getElementById("turbidityAlert");

  turbidityElement.textContent = light;

  if (light < 10) {
    turbidityAlertElement.textContent = "HIGH TURBIDITY LEVEL";
    turbidityAlertElement.style.color = "red";
  } else if (light >= 10) {
    turbidityAlertElement.textContent = "MODERATE TURBIDITY LEVEL";
    turbidityAlertElement.style.color = "green";
  } else {
    turbidityAlertElement.textContent = "LOW TURBIDITY LEVEL";
    turbidityAlertElement.style.color = "green";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Labels for monthly graph
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Generate random data for the charts
  const generateRandomData = () =>
    Array.from({ length: 12 }, () => Math.floor(Math.random() * 1000));

  // Water Level Chart
  const waterLevelCtx = document
    .getElementById("waterLevelChart")
    .getContext("2d");
  new Chart(waterLevelCtx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Water Level (cm)",
          data: generateRandomData(),
          borderColor: "#0077b6",
          backgroundColor: "rgba(0, 119, 182, 0.2)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });

  // Turbidity Chart
  const turbidityCtx = document
    .getElementById("turbidityChart")
    .getContext("2d");
  new Chart(turbidityCtx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Turbidity (Light Intensity)",
          data: generateRandomData(),
          backgroundColor: "#90e0ef",
          borderColor: "#0077b6",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });

  // Simulate real-time updates
  setInterval(() => {
    // Random real-time values
    const waterLevel = Math.floor(Math.random() * 100);
    const turbidity = Math.floor(Math.random() * 1000);

    // Update displayed values
    document.getElementById("waterLevel").textContent = `${waterLevel} cm`;
    document.getElementById("turbidityLevel").textContent = turbidity;

    // Update alerts
    document.getElementById("waterLevelAlert").textContent =
      waterLevel < 30 ? "Water level low!" : "Water level normal";
    document.getElementById("waterLevelAlert").className =
      waterLevel < 30 ? "alert red" : "alert green";

    document.getElementById("turbidityAlert").textContent =
      turbidity > 800 ? "High turbidity detected!" : "Turbidity level normal";
    document.getElementById("turbidityAlert").className =
      turbidity > 800 ? "alert orange" : "alert green";
  }, 2000);
});
