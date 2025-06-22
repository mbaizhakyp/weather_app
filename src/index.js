import "./styles.css";
const errorMsg = document.querySelector("#errorMsg");
const tempElement = document.querySelector("#temp");
const cityName = document.querySelector("#city");

function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function getWeather(location) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=9PUQUGTYMSARP938UZY5XVV8W&contentType=json`,
    { mode: "cors" }
  );
  const weatherData = await response.json();
  return weatherData.days[0].temp;
}
navigator.geolocation.getCurrentPosition(
  (position) => {
    const coords = `${position.coords.latitude},${position.coords.longitude}`;
    getWeather(coords).then((temp) => {
      document.getElementById("temp").textContent = `${temp}°C`;
    });
  },
  (error) => {
    console.warn("Could not get location. Using default.");
    getWeather("Almaty")
      .then((temp) => {
        document.getElementById("temp").textContent = `${temp}°C`;
        cityName.textContent = "Temperature in Almaty";
      })
      .catch(() => {
        alert("City not found. Please enter a valid location.");
      });
  }
);
const input = document.querySelector("#input");

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    let city = input.value.trim();
    city = capitalizeWords(city);

    if (city) {
      getWeather(city)
        .then((temperature) => {
          errorMsg.textContent = "";
          cityName.textContent = `Temperature in ${city}`;
          tempElement.textContent = `${temperature}°C`;
        })
        .catch(() => {
          errorMsg.textContent = "City not found";
        });
    }
  }
});
