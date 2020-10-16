function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (hours < 10) {
    hours = `0${hours}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[date.getDay()];
  let hours = date.getHours();
  let backgroundImage = document.querySelector("#background-image");

  if (hours >= 5 && hours < 12) {
    backgroundImage.setAttribute("src", "media/good-morning.png");
  } else if (hours >= 12 && hours < 17) {
    backgroundImage.setAttribute("src", "media/good-afternoon.png");
  } else if (hours >= 17 && hours < 20) {
    backgroundImage.setAttribute("src", "media/good-evening.png");
  } else if (hours >= 20 || hours < 3) {
    backgroundImage.setAttribute("src", "media/good-night.png");
  } else if (hours >= 3 && hours < 5) {
    backgroundImage.setAttribute("src", "media/mad-hour.png");
  }
  return `Last Updated: ${currentDay}, ${formatHours(timestamp)}`;
}

function showCurrentWeather(response) {
  let currentTime = document.querySelector("#current-date");
  currentTime.innerHTML = formatDate(response.data.dt * 1000);

  let currentDescription = response.data.weather[0].description;
  let showDescription = document.querySelector("#current-description");

  showDescription.innerHTML = `${currentDescription}`;

  let showCurrentTemp = document.querySelector("#current-temperature");
  currentCelsiusTemp = Math.round(response.data.main.temp);

  showCurrentTemp.innerHTML = `${currentCelsiusTemp}`;

  let showCurrentMax = document.querySelector("#current-temp-max");
  currentTempMax = Math.round(response.data.main.temp_max);

  showCurrentMax.innerHTML = `${currentTempMax}°`;

  let showCurrentMin = document.querySelector("#current-temp-min");
  currentTempMin = Math.round(response.data.main.temp_min);

  showCurrentMin.innerHTML = `${currentTempMin}°`;

  let currentHumidity = response.data.main.humidity;
  let showHumidity = document.querySelector("#current-humidity");

  showHumidity.innerHTML = `Humidity: ${currentHumidity}%`;

  let currentWindspeed = Math.round(response.data.wind.speed * 3.6);
  let showWindspeed = document.querySelector("#current-windspeed");

  showWindspeed.innerHTML = `Windspeed: ${currentWindspeed} km/h`;

  let currentWeatherIcon = document.querySelector("#current-weather-icon");
  currentWeatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  currentWeatherIcon.setAttribute(
    "alt",
    `${response.data.weather[0].description}`
  );
}

function showForecast(response) {
  console.log(response.data);

  let threeHourForecast = document.querySelector("#three-hour-forecast");
  let forecast = null;

  threeHourForecast.innerHTML = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastTempMaxList[index] = forecast.main.temp_max;
    forecastTempMinList[index] = forecast.main.temp_min;

    threeHourForecast.innerHTML += `
        <div class="col-md-2">
          <div class="card text-center">
            <div class="card-body">
              <h6>${formatHours(forecast.dt * 1000)}</h6>
              <img
                class="forecast-icon"
                src="https://openweathermap.org/img/wn/${
                  forecast.weather[0].icon
                }@2x.png"
                alt="clear"
              />
              <p class="card-text">
                <small class="forecast-temp-max"> 
                  ${Math.round(forecastTempMaxList[index])}°
                </small> | <small class="forecast-temp-min">${Math.round(
                  forecastTempMinList[index]
                )}° </small>
              </p>
            </div>
          </div>
        </div>
  `;
  }
}

function showLocationName(response) {
  let cityName = response.data.name;
  let countryName = response.data.sys.country;

  let currentLocation = document.querySelector("#searched-location");
  let apiKey = "3f5abe4ce673d5dda415df055d820a42";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;

  currentLocation.innerHTML = `${cityName}, ${countryName}`;

  axios.get(apiUrl).then(showCurrentWeather);
}

function search(city) {
  let apiKey = "3f5abe4ce673d5dda415df055d820a42";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showLocationName);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function showSearchedLocation(event) {
  event.preventDefault();
  let searchLocation = document.querySelector("#search-location");
  let city = searchLocation.value;

  search(city);
}

function currentCoordinates(position) {
  let currentLatitude = position.coords.latitude;
  let currentLongitude = position.coords.longitude;

  let apiKey = "3f5abe4ce673d5dda415df055d820a42";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${currentLatitude}&lon=${currentLongitude}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(showLocationName);
}

function useGeolocation() {
  navigator.geolocation.getCurrentPosition(currentCoordinates);
}

function convertToCelsius(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#current-temperature");
  let currentMax = document.querySelector("#current-temp-max");
  let currentMin = document.querySelector("#current-temp-min");
  let forecastMaxList = document.querySelectorAll(".forecast-temp-max");
  let forecastMinList = document.querySelectorAll(".forecast-temp-min");

  currentTemp.innerHTML = `${Math.round(currentCelsiusTemp)}`;
  currentMax.innerHTML = `${Math.round(currentTempMax)}°`;
  currentMin.innerHTML = `${Math.round(currentTempMin)}°`;

  for (let index = 0; index < 6; index++) {
    forecastMaxList[index].innerHTML = `${Math.round(
      forecastTempMaxList[index]
    )}°`;
    forecastMinList[index].innerHTML = `${Math.round(
      forecastTempMinList[index]
    )}°`;
  }

  degreesFahrenheit.classList.remove("active");
  degreesCelsius.classList.add("active");
}

function convertToFahrenheit(event) {
  event.preventDefault();

  let currentTemp = document.querySelector("#current-temperature");
  let currentMax = document.querySelector("#current-temp-max");
  let currentMin = document.querySelector("#current-temp-min");
  let forecastMaxList = document.querySelectorAll(".forecast-temp-max");
  let forecastMinList = document.querySelectorAll(".forecast-temp-min");

  let currentFahrenheitTemp = Math.round((currentCelsiusTemp * 9) / 5 + 32);
  let currentFahrenheitMax = Math.round((currentTempMax * 9) / 5 + 32);
  let currentFahrenheitMin = Math.round((currentTempMin * 9) / 5 + 32);

  currentTemp.innerHTML = `${currentFahrenheitTemp}`;
  currentMax.innerHTML = `${currentFahrenheitMax}°`;
  currentMin.innerHTML = `${currentFahrenheitMin}°`;

  for (let index = 0; index < 6; index++) {
    forecastMaxList[index].innerHTML = `${Math.round(
      (forecastTempMaxList[index] * 9) / 5 + 32
    )}°`;
    forecastMinList[index].innerHTML = `${Math.round(
      (forecastTempMinList[index] * 9) / 5 + 32
    )}°`;
  }

  degreesCelsius.classList.remove("active");
  degreesFahrenheit.classList.add("active");
}

let currentCelsiusTemp = null;
let currentTempMax = null;
let currentTempMin = null;
let forecastTempMaxList = [];
let forecastTempMinList = [];

let searchBar = document.querySelector("#search-bar");
let geolocationButton = document.querySelector("#geolocation-button");
let degreesCelsius = document.querySelector("#celsius-link");
let degreesFahrenheit = document.querySelector("#fahrenheit-link");

searchBar.addEventListener("submit", showSearchedLocation);
geolocationButton.addEventListener("click", useGeolocation);
degreesCelsius.addEventListener("click", convertToCelsius);
degreesFahrenheit.addEventListener("click", convertToFahrenheit);

search("London");
