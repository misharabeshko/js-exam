const apiKey = "0ab37c047bae4414a6b51830242106";

document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById("city");
    const savedCity = getCityCookie();

    if (savedCity) {
        cityInput.value = savedCity;
        fetchWeather(savedCity);
    }

    document.getElementById("get-weather").addEventListener("click", async function (e) {
        e.preventDefault();
        const city = cityInput.value;
        setCityCookie(city);
        await fetchWeather(city);
    });
});

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no&alerts=no`);
        const data = await response.json();

        if (response.ok) {
            displayWeather(data);
        } else {
            alert("Не вдалося отримати погоду. Спробуйте ще раз.");
        }
    } catch (error) {
        console.error(`Error fetching weather: ${error}`);
        alert("Сталася помилка при отриманні погоди. Перевірте консоль для деталей.");
    }
}

function displayWeather(data) {
    const weatherContainer = document.getElementById("weather-forecast");
    weatherContainer.innerHTML = '';

    data.forecast.forecastday.forEach(day => {
        const weatherItem = document.createElement("div");
        weatherItem.classList.add("weather-day");
        weatherItem.innerHTML = `
            <h2>${new Date(day.date).toLocaleDateString()}</h2>
            <img src="https:${day.day.condition.icon}" alt="Weather Icon">
            <p>Temp: ${day.day.avgtemp_c}°C</p>
            <p>Pressure: ${day.day.pressure_mb} mb</p>
            <p>Wind: ${day.day.maxwind_kph} kph</p>
            <p>Precipitation: ${day.day.totalprecip_mm} mm</p>
            <p>${day.day.condition.text}</p>
            `;
        weatherContainer.appendChild(weatherItem);
    });
}

function setCityCookie(city) {
    const date = new Date();
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `city=${city};${expires};path=/`;
}

function getCityCookie() {
    const nameEQ = "city=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
