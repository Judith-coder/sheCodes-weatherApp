//Switch temperature unit
function changeTemperatureUnit(event) {
  if (fahrenheitRadioButton.checked) {
    currentTemperature.innerHTML = Math.round(
      celsiusTemperature * (9 / 5) + 32
    );

    feelsLikeTemperatureElement.innerHTML = Math.round(
      feelsLikeTemperatureCelsius * (9 / 5) + 32
    );
    feelsLikeReveal.innerHTML = `Feels like: ${feelsLikeTemperatureElement.innerHTML}°F`;

    windSpeed.innerHTML = Math.round(windSpeed.innerHTML * 1.609344);
    windSpeedReveal.innerHTML = `Wind: ${windSpeed.innerHTML}miles/h`;
  } else {
    currentTemperature.innerHTML = Math.round(celsiusTemperature);

    feelsLikeTemperatureElement.innerHTML = Math.round(
      feelsLikeTemperatureCelsius
    );
    feelsLikeReveal.innerHTML = `Feels like: ${feelsLikeTemperatureElement.innerHTML}°C`;

    windSpeed.innerHTML = Math.round(windSpeedValueInternational);
    windSpeedReveal.innerHTML = `Wind: ${windSpeed.innerHTML}km/h`;
  }
}

//Display current weather
function displayCurrentWeather(response) {
  console.log(response.data);
  let cityHeading = document.querySelector("#city-heading");
  let city = response.data.name;
  let country = response.data.sys.country;
  cityHeading.innerHTML = `${city}, ${country}`;

  celsiusTemperature = response.data.main.temp;
  feelsLikeTemperatureCelsius = response.data.main.feels_like;
  windSpeedValueInternational = response.data.wind.speed * 3.6;

  currentTemperature.innerHTML = Math.round(celsiusTemperature);

  let currentWeather = document.querySelector("#current-weather-description");
  currentWeather.innerHTML = response.data.weather[0].main;

  weatherIcon = response.data.weather[0].icon;
  iconElement.classList.remove(
    "fa-sun",
    "fa-moon",
    "fa-cloud-sun",
    "fa-cloud-moon",
    "fa-cloud",
    "fa-cloud-showers-heavy",
    "fa-cloud-rain",
    "fa-bolt",
    "fa-snowflake",
    "fa-smog"
  );
  iconElement.classList.add(icons[weatherIcon]);

  feelsLikeTemperatureElement.innerHTML = Math.round(
    feelsLikeTemperatureCelsius
  );
  feelsLikeReveal.innerHTML = `Feels like: ${feelsLikeTemperatureElement.innerHTML}°C`;

  windSpeed.innerHTML = Math.round(windSpeedValueInternational);
  windSpeedReveal.innerHTML = `Wind: ${windSpeed.innerHTML}km/h`;

  let humidity = Math.round(response.data.main.humidity);
  let humidityReveal = document.querySelector("#humidity");
  humidityReveal.innerHTML = `Humidity: ${humidity}%`;
}

// Display searched city
function checkUrl(url) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.send();
  request.onload = function () {
    status = request.status;
    if (request.status == 404) {
      alert`Please enter your city again`;
      location.reload();
    }
  };
}

function searchCity(city) {
  let apiKey = "07fdd9a483e10a4554fcd7222bb43e7b";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let units = "metric";
  let apiUrl = `${apiEndpoint}q=${city}&appid=${apiKey}&units=${units}`;

  checkUrl(apiUrl);
  axios.get(apiUrl).then(displayCurrentWeather);
}

function updateCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let cityHeading = document.querySelector("#city-heading");
  cityHeading.innerHTML = `${cityInput.value}`;
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

// Display current time

function displayCurrentDate(time) {
  let date = time.getDate();
  let hour = time.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednedsay",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[time.getDay()];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[time.getMonth()];

  return `${day} | ${month}, ${date} | ${hour}h${minutes}`;
}

// Global variables

let celsiusTemperature = null;
let feelsLikeTemperatureCelsius = null;
let windSpeedValueInternational = null;
let currentTemperature = document.querySelector("#current-temperature");
let feelsLikeTemperatureElement = document.querySelector(
  "#feels-like-temperature"
);
let windSpeed = document.querySelector("#wind-speed-value");
let feelsLikeReveal = document.querySelector("#feels-like");
let windSpeedReveal = document.querySelector("#wind-speed");

let celsiusRadioButton = document.querySelector("#celsius-degrees-input");
let fahrenheitRadioButton = document.querySelector("#fahrenheit-degrees-input");

celsiusRadioButton.addEventListener("click", changeTemperatureUnit);
fahrenheitRadioButton.addEventListener("click", changeTemperatureUnit);

let citySearchForm = document.querySelector("#city-search-form");
citySearchForm.addEventListener("submit", updateCity);

let currentTime = new Date();
let timeDisplay = document.querySelector("h2");
timeDisplay.innerHTML = displayCurrentDate(currentTime);

let icons = {
  "01d": "fa-sun", // Clear sky day,
  "01n": "fa-moon", // Clear sky night
  "02d": "fa-cloud-sun", // Few clouds day
  "02n": "fa-cloud-moon", // Few clouds night
  "03d": "fa-cloud", // Scattered clouds day
  "03n": "fa-cloud", // Scattered clouds night
  "04d": "fa-cloud", // Broken clouds day
  "04n": "fa-cloud", // Broken clouds night
  "09d": "fa-cloud-showers-heavy", // Shower rain day
  "09n": "fa-cloud-showers-heavy", // Shower rain night
  "10d": "fa-cloud-rain", // Rain day
  "10n": "fa-cloud-rain", // Rain night
  "11d": "fa-bolt", // Thunderstorm day
  "11n": "fa-bolt", // Thunderstorm night
  "13d": "fa-snowflake", // Snow day
  "13n": "fa-snowflake", // Snow sky night
  "50d": "fa-smog", // Mist day
  "50n": "fa-smog", // Mist night
};

let weatherIcon = null;
let iconElement = document.querySelector("#current-weather-icon");

// Display default location's weather

searchCity("Bordeaux");
