function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[now.getDay()];

  let currentHour = now.getHours();
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }

  let currentMinute = now.getMinutes();
  if (currentMinute < 10) {
    currentMinute = `0${currentMinute}`;
  }

  return `${currentDay}, ${currentHour}:${currentMinute}`;
}

function showCurrentWeather(response) {
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

function search(city) {
  let apiKey = "3f5abe4ce673d5dda415df055d820a42";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(showLocationName);
}

function showSearchedLocation(event) {
  event.preventDefault();
  let searchLocation = document.querySelector("#search-location");
  let searchedLocation = document.querySelector("#searched-location");
  let city = searchLocation.value;

  search(city);
  searchedLocation.innerHTML = `${city}`;
}

function showLocationName(response) {
  let locationName = response.data.name;

  let currentLocation = document.querySelector("#searched-location");
  let apiKey = "3f5abe4ce673d5dda415df055d820a42";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&units=metric&appid=${apiKey}`;

  currentLocation.innerHTML = locationName;

  axios.get(apiUrl).then(showCurrentWeather);
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

let todaysDate = document.querySelector("#current-date");

let now = new Date();

todaysDate.innerHTML = formatDate(now);

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
