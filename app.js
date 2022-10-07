let allStoredCities = JSON.parse(localStorage.getItem("storedCities")) || [];
const currentDiv = document.getElementById("currentDiv");
const fiveDays = document.getElementById("fiveDay");

allStoredCities.forEach((city) => {
    document.getElementById("searchedCities").innerHTML += `
        <p data-city="${city}" class="storedCity"> ${city}</p>
        `;
});

const makeGetRequest = async (url) => {
    try {
        const res = await axios.get(url);

        return res.data;
    } catch (error) {
        console.error(error);
    }
};

const setLocalStorage = (cityName) => {
    let storedCities = JSON.parse(localStorage.getItem("storedCities")) || [];

    let city = storedCities.includes(cityName);

    if (!city) {
        storedCities.push(cityName);
        localStorage.setItem("storedCities", JSON.stringify(storedCities));
    }
};

const showCard = (weatherDataArray) => {
    if (!weatherDataArray.length) {
        return;
    }
    currentDiv.innerHTML = `
    <div class="row">
        <div class="col s12 m7">
        <div class="card">
            <div class="card-image">
            <img src="https://openweathermap.org/img/wn/${weatherDataArray.list[0].weather[0].icon}@4x.png">
            <span class="card-title blue-text">${weatherDataArray.city.name}</span>
            </div>
            <div class="card-content">
            <p>${weatherDataArray.list[0].dt_txt}</p>
            <p> Temp: ${weatherDataArray.list[0].main.temp} °F</p>
            <p> Humidity: ${weatherDataArray.list[0].main.humidity} %</p>
            <p> Wind speed: ${weatherDataArray.list[0].wind.speed} mph</p>
            
            </div>
            <div class="card-action">
           
            </div>
        </div>
        </div>
    </div>`;
};

const getWeatherForWeek = (weatherArray) => {
    if (!weatherArray.length) {
        return;
    }
    let cards = "";

    for (let i = 0; i < weatherArray.length; i += 8) {
        cards += `
    <div class="row">
        <div class="col s12 m7">
        <div class="card">
            <div class="card-image">
            <img src="https://openweathermap.org/img/wn/${weatherArray[i].weather[0].icon}@4x.png">
            <span class="card-title blue-text">${weatherArray[i].dt_txt}</span>
            </div>
            <div class="card-content">
            <p>Temp: ${weatherArray[i].main.temp} °F</p>
            <p>Humidity: ${weatherArray[i].main.humidity} %</p>
            </div>
            <div class="card-action">
            </div>
        </div>
        </div>
    </div>
​
    `;
    }

    fiveDays.innerHTML = cards;
};

const getData = async (cityName) => {
    const cityUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=20948a341240bc75635af713a3f5df69`;

    const city = await makeGetRequest(cityUrl);
    if (!city) {
        alert("Sorry, please enter a valid city name");
        return;
    }
    setLocalStorage(cityName);
    showCard(city);
    getWeatherForWeek(city.list);
};

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("storedCity")) {
        let cityName = event.target.dataset.city;
        getData(cityName);
    }
});

document.getElementById("searchBtn").addEventListener("click", (event) => {
    let cityName = document.getElementById("cityName").value;
    getData(cityName);
});