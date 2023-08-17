// import axios from 'axios';

let key = 'a96ffff2f3bc288c7960935106d1cfad'; //private
let btncurr = document.getElementById('btncurr');
let form = document.querySelector('.form');
let temp = document.getElementById('temp');
let input = document.getElementById('input');
let mainImg = document.getElementById('main');
let farenheit = document.getElementById('farenheit');
let celcius = document.getElementById('celcius');

let city = document.getElementById('city');
let humidity = document.querySelectorAll('#humidity');
let wind = document.querySelectorAll('#wind');
let desc = document.getElementById('desc');

let celciusTemp = null;
let farenheitTemp = null;

function displayDate() {
  let currDay = document.getElementById('day');
  let currHour = document.getElementById('hour');
  let currMin = document.getElementById('min');
  let date = new Date();
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  let day = days[date.getDay()];
  currDay.innerHTML = `${day} `;

  let hour = date.getHours();
  let minute = date.getMinutes();
  if (hour < 10) {
    currHour.innerHTML = `0${hour}`;
  } else {
    currHour.innerHTML = `${hour}`;
  }
  if (minute < 10) {
    currMin.innerHTML = `0${minute}`;
  } else {
    currMin.innerHTML = `${minute}`;
  }
}

setInterval(displayDate, 1000);

function showWeather(response) {
  console.log(response);
  celciusTemp = response.data.main.temp;
  let cityTemp = Math.round(celciusTemp);
  let cityName = response.data.name;
  let cityWind = Math.round(response.data.wind.speed);
  let cityHumid = response.data.main.humidity;
  let cityDesc = response.data.weather[0].description;
  city.innerHTML = cityName;
  temp.innerHTML = cityTemp;
  mainImg.setAttribute(
    'src',
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  mainImg.setAttribute('alt', response.data.weather[0].description);
  humidity[0].innerHTML = `${cityHumid}%`;
  humidity[1].innerHTML = `${cityHumid}%`;
  wind[0].innerHTML = `${cityWind}km/h`;
  wind[1].innerHTML = `${cityWind}km/h`;
  desc.innerHTML = cityDesc;
}

function Submitform(event) {
  event.preventDefault();
  let weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${key}&units=metric`;
  axios.get(weatherApi).then(showWeather);
}
form.addEventListener('submit', Submitform);

function getPosition(position) {
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function checklocation() {
  navigator.geolocation.getCurrentPosition(getPosition);
}

btncurr.addEventListener('click', checklocation);

function convertToFarenheit(event) {
  event.preventDefault();
  farenheitTemp = celciusTemp * 1.8 + 32;
  temp.innerHTML = Math.round(farenheitTemp);
  farenheit.classList.add('active');
  celcius.classList.remove('active');
}
farenheit.addEventListener('click', convertToFarenheit);

function convertToCelcius(event) {
  event.preventDefault();
  temp.innerHTML = Math.round(celciusTemp);
  farenheit.classList.remove('active');
  celcius.classList.add('active');
}
celcius.addEventListener('click', convertToCelcius);
