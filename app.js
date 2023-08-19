// import axios from 'axios';

let key = '0ebc654fccbc00189d5408f3d6f15b08'; //private
let btncurr = document.getElementById('btncurr');
let form = document.querySelector('.form');
let liDays = document.querySelector('.days');
let temp = document.getElementById('temp');
let input = document.getElementById('input');
let mainImg = document.getElementById('main');
let farenheit = document.getElementById('farenheit');
let celcius = document.getElementById('celcius');
let uv = document.getElementById('uv');
let sunset = document.getElementById('sunset');
let precip = document.getElementById('precip');
let feels = document.getElementById('feels');
let visib = document.getElementById('visib');
let press = document.getElementById('press');
let country = document.getElementById('country');

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
  // let uvIndex = response.data.weather[0].description;
  let sunsetresponse = new Date(response.data.sys.sunset * 1000);
  // let precipitation = response.data.current.precipitation.value;
  let feelsLike = Math.round(response.data.main.feels_like);
  let visibility = response.data.visibility;
  let pressure = response.data.main.pressure;
  let cityCountry = response.data.sys.country;
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
  sunset.innerHTML = sunsetresponse.toGMTString();
  // precip.innerHTML = precipitation;
  feels.innerHTML = `${feelsLike}°C`;
  visib.innerHTML = `${visibility / 1000}km`;
  press.innerHTML = `${pressure}hPa`;
  country.innerHTML = `${cityName}, ${cityCountry}`;
  getPrediction(response.data.coord, cityName);
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

function getPrediction(coordinates, city) {
  console.log(coordinates, city);
  let thisKey = '3e340aaf70ff73cc9do1tdba1aa636e5';
  // let predictAPI = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${key}&units=metric`;
  let predictAPI = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${thisKey}&units=metric`;
  axios.get(predictAPI).then(displayPrediction);
}

function displayPrediction(response) {
  let forecasts = response.data.daily;
  let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let dayHTML = `div class="days col-3">`;
  forecasts.forEach(function (d, index) {
    let dayd = new Date(d.time * 1000);
    dayName = dayd.getDay();
    if (index < 8) {
      dayHTML =
        dayHTML +
        `
      <div class="${days[dayName]}">
              <ul>
                <li class="day">${days[dayName]}</li>
                <li class="icon">
                  <img
                    src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                      d.condition.icon
                    }.png"
                    alt="img"
                  />
                </li>
                <li class="temp"><span>${Math.round(
                  d.temperature.maximum
                )}°</span> <span>${Math.round(
          d.temperature.minimum
        )}°</span></li>
              </ul>
        </div>
      `;
    }
  });
  dayHTML = dayHTML + `</div>`;
  // liDays.innerHTML = dayHTML;
}
