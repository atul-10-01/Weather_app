document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "4be6c9b1c7c23ad1e86cfed28c012d53";
    const searchForm = document.querySelector("#city-name");
    const cityInput = document.querySelector(".search-input");
    const weatherInfo = document.querySelector(".weather-info");

    function loadingAnimation(delay) {
        let loadingTimeline = gsap.timeline();
    
        loadingTimeline.from(".weather-title", {
            y: 20,
            opacity: 0,
            delay: delay,
            duration: 0.7,
            stagger: 0.3
        });
    }
    
    loadingAnimation(0.4);

    async function getWeatherData(city) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
            const data = await response.json();

            if (response.ok) {
                displayWeather(data);
            } else {
                console.error("Error fetching weather data:", data.message);
                weatherInfo.innerHTML = `<div>Error: ${data.message} <br> Please Refresh the Page</div>`;
            }
        } catch (error) {
            console.error("Error fetching weather data:", error.message);
            weatherInfo.innerHTML = `<div>Error: ${error.message}</div>`;
        }
    }

    function displayWeather(data) {
        const temperature = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;
        const humidity = data.main.humidity;
        const wind = data.wind.speed;

        updateBackgroundWithAnimation(icon);

        const timeline = gsap.timeline();
        timeline.fromTo(".city, .description, .temperature", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.1 });
        timeline.fromTo(".icon", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.1 }, "-=0.1");
        timeline.fromTo(".humidity, .wind", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.1 }, "-=0.1");

        document.querySelector(".city").innerHTML = `${data.name}, ${data.sys.country}`;
        document.querySelector(".icon").innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">`;
        document.querySelector(".description").innerHTML = `${description}`;
        document.querySelector(".temperature").innerHTML = `<h2>${temperature}°C</h2>`;
        document.querySelector(".humidity").innerHTML = `${humidity}%`;
        document.querySelector(".wind").innerHTML = `${wind} km/h`;


        gsap.to(".weather", { opacity: 1, duration: 0.1 });
    }

    function updateBackgroundWithAnimation(weatherIcon) {
        const backgroundDiv = document.querySelector(".background");
        const newBackgroundImage = determineBackgroundImage(weatherIcon);


        gsap.to(backgroundDiv, {
            opacity: 0,
            duration: 0.1,
            onComplete: function () {
                backgroundDiv.style.backgroundImage = `url("${newBackgroundImage}")`;
                gsap.to(backgroundDiv, { opacity: 1, duration: 0.1 });
            }
        });
    }

    function determineBackgroundImage(weatherIcon, description) {
        const isDay = weatherIcon.includes("d");
        const isNight = weatherIcon.includes("n");
        const isSunny = weatherIcon.includes("01");
        const isSmoke = weatherIcon.includes("50");
        const isSnow = weatherIcon.includes("13");
        const isCloudy = weatherIcon.includes("03") || weatherIcon.includes("04");
        const isRain = weatherIcon.includes("09") || weatherIcon.includes("10");
        const isClearEvening = weatherIcon.includes("02");

        if (isDay && isSunny) {
            return 'Sunny.png';
        } else if (isNight && isCloudy) {
            return 'night cloud.jpg';
        } else if (isRain) {
            return 'Rain.png';
        } else if (description == "mist" && isDay) {
            return 'mist.jpg';
        } else if (isSmoke && isDay) {
            return 'Smoke.png';
        } else if (isSmoke && isNight) {
            return 'night mist.jpg';
        } else if (isSnow) {
            return 'Snow.jpg';
        } else if (isNight) {
            return 'Night.png';
        } else if (isClearEvening) {
            return 'Evening.png';
        } else if (description == "scattered clouds" || description == "broken clouds" && isDay) {
            return 'Scattered Clouds.jpg';
        } else {
            return 'Day.png';
        }
    }

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const city = cityInput.value.trim();
        console.log("City:", city);
        if (city !== "") {
            getWeatherData(city);
        }
        loadingAnimation(0.5);
        gsap.to(".weather", {
            opacity: 1, duration: 0.2, delay: 0.15, onComplete: function () {
                
                document.querySelector(".weather").style.visibility = "visible";
            }
        });
    });

});

