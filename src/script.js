//Switch temperature unit
function changeTemperatureUnit(event) {
  let currentTemperature = document.querySelector("#current-temperature");
  let feelsLikeTemperature = document.querySelector("#feels-like-temperature");
  let feelsLikeReveal = document.querySelector("#feels-like");
  let windSpeed = document.querySelector("#wind-speed-value");
  let windSpeedReveal = document.querySelector("#wind-speed");

  if (fahrenheitRadioButton.checked) {
    currentTemperature.innerHTML = Math.round(
      currentTemperature.innerHTML * (9 / 5) + 32
    );

    feelsLikeTemperature.innerHTML = Math.round(
      feelsLikeTemperature.innerHTML * (9 / 5) + 32
    );
    feelsLikeReveal.innerHTML = `Feels like: ${feelsLikeTemperature.innerHTML}°F`;

    windSpeed.innerHTML = Math.round(windSpeed.innerHTML * 1.609344);
    windSpeedReveal.innerHTML = `Wind: ${windSpeed.innerHTML}miles/h`;
  } else {
    currentTemperature.innerHTML = Math.round(
      (currentTemperature.innerHTML - 32) * (5 / 9)
    );

    feelsLikeTemperature.innerHTML = Math.round(
      (feelsLikeTemperature.innerHTML - 32) * (5 / 9)
    );
    feelsLikeReveal.innerHTML = `Feels like: ${feelsLikeTemperature.innerHTML}°C`;

    windSpeed.innerHTML = Math.round(windSpeed.innerHTML / 1.609344);
    windSpeedReveal.innerHTML = `Wind: ${windSpeed.innerHTML}km/h`;
  }
}

let celsiusRadioButton = document.querySelector("#celsius-degrees-input");
let fahrenheitRadioButton = document.querySelector("#fahrenheit-degrees-input");

celsiusRadioButton.addEventListener("click", changeTemperatureUnit);
fahrenheitRadioButton.addEventListener("click", changeTemperatureUnit);

//Display current weather
function displayCurrentWeather(response) {
  let cityHeading = document.querySelector("#city-heading");
  let city = response.data.name;
  let country = response.data.sys.country;
  cityHeading.innerHTML = `${city}, ${country}`;

  let currentTemperature = document.querySelector("#current-temperature");
  currentTemperature.innerHTML = Math.round(response.data.main.temp);

  let currentWeather = document.querySelector("#current-weather-description");
  currentWeather.innerHTML = response.data.weather[0].main;

  let feelsLikeTemperature = document.querySelector("#feels-like-temperature");
  feelsLikeTemperature.innerHTML = Math.round(response.data.main.feels_like);

  let windSpeed = document.querySelector("#wind-speed-value");
  windSpeed.innerHTML = Math.round(response.data.wind.speed * 3.6);

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
let citySearchForm = document.querySelector("#city-search-form");
citySearchForm.addEventListener("submit", updateCity);

// Display default location's weather

searchCity("Bordeaux");

// Display current location
function searchPosition() {
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

function retrievePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "07fdd9a483e10a4554fcd7222bb43e7b";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let units = "metric";
  let apiUrl = `${apiEndpoint}&lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayCurrentWeather);
}

let button = document.querySelector("button");
button.addEventListener("click", searchPosition);

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

let currentTime = new Date();
let timeDisplay = document.querySelector("h2");
timeDisplay.innerHTML = displayCurrentDate(currentTime);
