//Variable declarations:
var cityFormEl=document.querySelector("#city-search-form");
var cityInputEl=document.querySelector("#city");
var weatherContainerEl=document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");
//here is my array variable declaration for my cities. 
var cities = [];

//Need a function to do the 'submit click' and do the search
var citySubmitSearch = function(event){
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if(city){
        currentCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        cityInputEl.value = "";
    } else{
        console.alert("Please enter a City");
    }
    savedCitySearch();
    pastCitySearch(city);
}
//this is setting my array to local storage. 
var savedCitySearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

//this is getting my weather for the current city
var currentCityWeather = function(city){
    var apiKey = "962bbe1a836c3fe5f493889d073b6c0c"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            showcurrentCityWeather(data, city);
        });
    });
};

//this is going to be my function where I will be displaying my current city's weather 
var showcurrentCityWeather = function(weather, searchCity) {
    weatherContainerEl.textContent= "";  
    citySearchInputEl.textContent=searchCity;

    //going to create my city/date: Temp: Wind: Humidity: 
    var currentDate = document.createElement("span")
    currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    citySearchInputEl.appendChild(currentDate);

    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`);
    citySearchInputEl.appendChild(weatherIcon);

    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temp: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item"
    weatherContainerEl.appendChild(temperatureEl);

    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "list-group-item"
    weatherContainerEl.appendChild(windSpeedEl);

    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item"
    weatherContainerEl.appendChild(humidityEl);

}

//This function is getting the 5-day data. 
var get5Day = function(city){
    var apiKey = "962bbe1a836c3fe5f493889d073b6c0c"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
};

//This is displaying the cards for the 5-day forecast. 
var display5Day = function(weather){
    forecastContainerEl.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
       for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";

       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}.png`);  
       forecastEl.appendChild(weatherIcon);
       
       var forecastTempEl = document.createElement("span");
       forecastTempEl.classList = "card-body text-center";
       forecastTempEl.textContent = "Temp: " + dailyForecast.main.temp + " °F";
       forecastEl.appendChild(forecastTempEl);

       var forecastwindEl = document.createElement("span")
       forecastwindEl.classList = "card-body text-center";
       forecastwindEl.textContent = "Wind Speed: " + dailyForecast.wind.speed + " MPH";
       forecastEl.appendChild(forecastwindEl);

       var forecastHumEl = document.createElement("span");
       forecastHumEl.classList = "card-body text-center";
       forecastHumEl.textContent = "Humidity: " + dailyForecast.main.humidity + "  %";
       forecastEl.appendChild(forecastHumEl);

       forecastContainerEl.appendChild(forecastEl);
    }
}

 //creating my buttons from the past searches that are on the list. 
var pastCitySearch = function(pastSearch) {
    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");
    pastSearchButtonEl.appendChild(pastSearchEl); //fixed my issue with the order list being created correctly. 
}

var pastCitySearchHistory = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        currentCityWeather(city);
        get5Day(city);
    }
}
//these are my eventListeners for the submit and past city history 
cityFormEl.addEventListener("submit", citySubmitSearch);
pastSearchButtonEl.addEventListener("click", pastCitySearchHistory);