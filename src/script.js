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

    windSpeed.innerHTML = Math.round(windSpeedValueAmerican);
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

// Format Hour
function formatHour(timestamp, timeZoneOffsetSearchedCity) {
  let date = new Date(timestamp * 1000);
  let hour =
    date.getHours() +
    currentLocationTimeZoneOffset / 60 +
    timeZoneOffsetSearchedCity / 3600;

  if (hour >= 24) {
    hour = hour - 24;
  } else if (hour < 0) {
    hour = 24 + hour;
  }
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = date.getMinutes();

  let min = date.getMinutes();
  if (min < 10) {
    min = `0${min}`;
  }
  return `${hour}:${min}`;
}

// Format Day
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

// Display 3-hours forecast
function display3HoursForecast(response) {
  let hourlyForecast = response.data.hourly;
  let hourlyForecastElement = document.querySelector("#hourly-forecast");
  let hourlyForecastHTML = ``;

  console.log(hourlyForecast);
  hourlyForecast.forEach(function (forecastHour, index) {
    if (
      index === 3 ||
      index === 6 ||
      index === 9 ||
      index === 12 ||
      index === 15
    ) {
      hourlyForecastHTML =
        hourlyForecastHTML +
        `
    <div class="col">
            <div class="card">
              <div class="card-body">
                <h5>${formatHour(
                  forecastHour.dt,
                  timeZoneOffsetSearchedCity
                )}</h5>
                <i class="fas forecastIcons ${
                  icons[forecastHour.weather[0].icon]
                }"></i>
                <p>${Math.round(forecastHour.temp)}°C</p>
              </div>
            </div>
            </div>`;
    }
  });
  hourlyForecastElement.innerHTML = hourlyForecastHTML;
}

// Display daily forecast
function displayDailyForecast(response) {
  console.log(response);
  let dailyForecast = response.data.daily;
  let dailyForecastElement = document.querySelector("#daily-forecast");
  let dailyForecastHTML = ``;

  dailyForecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      dailyForecastHTML =
        dailyForecastHTML +
        `<div class="col">
            <div class="card">
              <div class="card-body">
                <h5>${formatDay(forecastDay.dt)}</h5>
                <i class="fas forecastIcons ${
                  icons[forecastDay.weather[0].icon]
                }"></i>
                <p>${Math.round(forecastDay.temp.min)}°| ${Math.round(
          forecastDay.temp.max
        )}°</p>
              </div>
            </div>
          </div>`;
    }
  });
  dailyForecastElement.innerHTML = dailyForecastHTML;
}

// Get API url for the forecast data
function getForecast(coordinates) {
  let apiKey = "07fdd9a483e10a4554fcd7222bb43e7b";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/onecall?";
  let latitude = coordinates.lat;
  let longitude = coordinates.lon;
  let units = "metric";
  let apiUrl = `${apiEndpoint}lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(display3HoursForecast);
  axios.get(apiUrl).then(displayDailyForecast);
}

//Display current weather
function displayCurrentWeather(response) {
  console.log(response);
  let cityHeading = document.querySelector("#city-heading");
  let city = response.data.name;
  let country = response.data.sys.country;
  cityHeading.innerHTML = `${city}, ${country}`;

  celsiusTemperature = response.data.main.temp;
  feelsLikeTemperatureCelsius = response.data.main.feels_like;
  windSpeedValueInternational = response.data.wind.speed * 3.6;
  windSpeedValueAmerican = response.data.wind.speed * 3.6 * 1.609344;

  currentTemperature.innerHTML = Math.round(celsiusTemperature);

  let currentWeather = document.querySelector("#current-weather-description");
  currentWeather.innerHTML = response.data.weather[0].main;

  let iconElement = document.querySelector("#current-weather-icon");
  iconElement.innerHTML = `<i class="fas ${
    icons[response.data.weather[0].icon]
  }" id="current-weather-icon"></i>`;

  feelsLikeTemperatureElement.innerHTML = Math.round(
    feelsLikeTemperatureCelsius
  );
  feelsLikeReveal.innerHTML = `Feels like: ${feelsLikeTemperatureElement.innerHTML}°C`;

  windSpeed.innerHTML = Math.round(windSpeedValueInternational);
  windSpeedReveal.innerHTML = `Wind: ${windSpeed.innerHTML}km/h`;

  let humidity = Math.round(response.data.main.humidity);
  let humidityReveal = document.querySelector("#humidity");
  humidityReveal.innerHTML = `Humidity: ${humidity}%`;

  getForecast(response.data.coord);

  /// ZONE TEST
  timeZoneOffsetSearchedCity = response.data.timezone; // timeZoneOffsetSearchedCity exprimé en secondes
  timeDisplay.innerHTML = displayCurrentDate(
    currentTime,
    timeZoneOffsetSearchedCity
  ); //// TEST !!!!!!!!!!!!!!
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

function displayCurrentDate(time, timeZoneOffsetSearchedCity) {
  let date = time.getDate();

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

  let hour =
    time.getHours() +
    currentLocationTimeZoneOffset / 60 +
    timeZoneOffsetSearchedCity / 3600;
  console.log(time.getHours());
  console.log(currentLocationTimeZoneOffset / 60);
  console.log(timeZoneOffsetSearchedCity / 3600);
  console.log(hour);
  if (hour >= 24) {
    hour = hour - 24;
    day = days[time.getDay() + 1];
    date = time.getDate() + 1;
  } else if (hour < 0) {
    hour = 24 + hour;
    day = days[time.getDay() - 1];
    date = time.getDate() - 1;
  }
  //if (time.getHours() <= 12 && hour >= 12 && hour <= 24) {
  //  day = days[time.getDay() + 1];
  //  date = time.getDate() - 1;
  //}
  if (hour < 10) {
    hour = `0${hour}`;
  }

  let minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day} | ${month}, ${date} | ${hour}h${minutes}`;
}

// Global variables

let celsiusTemperature = null;
let feelsLikeTemperatureCelsius = null;
let windSpeedValueInternational = null;
let windSpeedValueAmerican = null;
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
let currentLocationTimeZoneOffset = currentTime.getTimezoneOffset(); // Time zone offset provided in minutes
let timeZoneOffsetSearchedCity = null;
let timeDisplay = document.querySelector("h2");

//timeDisplay.innerHTML = displayCurrentDate(currentTime);

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

// Display default location's weather

searchCity("Bordeaux");
