const apiKey = "api key";

async function fetchWeather() {
    const searchInput = document.getElementById("search").value.trim();
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.style.display = "block";

    if (searchInput === "") {
        weatherDataSection.innerHTML = `
        <div>
            <h2>Empty Input!</h2>
            <p>Please try again with a valid <u>city name</u>.</p>
        </div>`;
        return;
    }

    async function getLonAndLat() {
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)}&limit=1&appid=${apiKey}`;
        const response = await fetch(geocodeURL);

        if (!response.ok) {
            console.log("Bad response!", response.status);
            return;
        }

        const data = await response.json();
        if (data.length === 0) {
            console.log("No results found");
            weatherDataSection.innerHTML = `
            <div>
                <h2>Invalid Input: "${searchInput}"</h2>
                <p>Please try again with a valid <u>city name</u>.</p>
            </div>`;
            return null;
        }

        return data[0]; // contains lat & lon
    }

    async function getWeatherData(lat, lon) {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(weatherURL);

        if (!response.ok) {
            console.log("Weather API error", response.status);
            return;
        }

        const data = await response.json();
        weatherDataSection.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
        <div>
            <h2>${data.name}</h2>
            <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
            <p><strong>Description:</strong> ${data.weather[0].description}</p>
        </div>`;
    }

    const geoData = await getLonAndLat();
    if (geoData) {
        await getWeatherData(geoData.lat, geoData.lon);
    }

    document.getElementById("search").value = "";
}







