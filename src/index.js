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

  return `${currentDay}, ${formatHours(timestamp)}`;
}

function showCurrentWeather(response) {
  let currentTime = document.querySelector("#current-date");
  currentTime.innerHTML = formatDate(response.data.dt * 1000);

  let currentDescription = response.data.weather[0].description;
  let showDescription = document.querySelector("#current-description");

  showDescription.innerHTML = `${currentDescription}`;

  let showCurrentTemperature = document.querySelector("#current-temperature");
  currentCelsiusTemperature = Math.round(response.data.main.temp);

  showCurrentTemperature.innerHTML = `${currentCelsiusTemperature}°`;

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

  showWindspeed.innerHTML = `Windspeed: ${currentWindspeed}km/h`;

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

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();

  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

function showForecast(response) {
  console.log(response.data);

  let threeHourForecast = document.querySelector("#forecast");
  let forecast = null;
  threeHourForecast.innerHTML = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
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
                <small> <strong>${Math.round(
                  forecast.main.temp_max
                )}°</strong> | ${Math.round(forecast.main.temp_min)}° </small>
              </p>
            </div>
          </div>
        </div>
  `;
  }
}

function showLocationName(response) {
  console.log(response.data);
  let locationName = response.data.name;

  let currentLocation = document.querySelector("#searched-location");
  let apiKey = "3f5abe4ce673d5dda415df055d820a42";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&units=metric&appid=${apiKey}`;

  currentLocation.innerHTML = locationName;

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
  let searchedLocation = document.querySelector("#searched-location");
  let city = searchLocation.value;

  search(city);
  searchedLocation.innerHTML = `${city}`;
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
  let currentTemperature = document.querySelector("#current-temperature");
  let currentMax = document.querySelector("#current-temp-max");
  let currentMin = document.querySelector("#current-temp-min");

  currentTemperature.innerHTML = `${Math.round(currentCelsiusTemperature)}°`;
  currentMax.innerHTML = `${Math.round(currentTempMax)}°`;
  currentMin.innerHTML = `${Math.round(currentTempMin)}°`;

  degreesFahrenheit.classList.remove("active");
  degreesCelsius.classList.add("active");
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#current-temperature");
  let currentMax = document.querySelector("#current-temp-max");
  let currentMin = document.querySelector("#current-temp-min");
  let fahrenheitTemperature = Math.round(
    (currentCelsiusTemperature * 9) / 5 + 32
  );
  let fahrenheitMax = Math.round((currentTempMax * 9) / 5 + 32);
  let fahrenheitMin = Math.round((currentTempMin * 9) / 5 + 32);

  currentTemperature.innerHTML = `${fahrenheitTemperature}°`;
  currentMax.innerHTML = `${fahrenheitMax}°`;
  currentMin.innerHTML = `${fahrenheitMin}°`;

  degreesCelsius.classList.remove("active");
  degreesFahrenheit.classList.add("active");
}

let searchBar = document.querySelector("#search-bar");

searchBar.addEventListener("submit", showSearchedLocation);
search("London");

let currentCelsiusTemperature = null;
let currentTempMax = null;
let currentTempMin = null;

let degreesCelsius = document.querySelector("#celsius-link");
let degreesFahrenheit = document.querySelector("#fahrenheit-link");

degreesCelsius.addEventListener("click", convertToCelsius);
degreesFahrenheit.addEventListener("click", convertToFahrenheit);

let geolocationButton = document.querySelector("#geolocation-button");
geolocationButton.addEventListener("click", useGeolocation);
