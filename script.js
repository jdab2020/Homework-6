$(document).ready(function () {
    let cities = [];
    renderLocalStorage();

    function renderLocalStorage () {
        let test = localStorage.getItem("savedCity");
        if (!test) {
            return;
        }
        cities = JSON.parse(localStorage.getItem("savedCity"))
        $(cities).each(function () {
            let city = this;
            renderSideBar(city);
        });
    }
    // function to display each city
    function renderSideBar(city) {
        let cityli = $("<li>");
        $(cityli).addClass("nav-item");
        let cityA = $("<a>");
        $(cityA).addClass("nav-link text-primary border")
        $(cityA).text(city)
        $(cityli).append(cityA)
        $("#side").append(cityli)
    }
    // function to get data from openweathermap
    $(".nav-item").on("click", function () {
        console.log($(this).text());
        console.log($(this).val());
        let city = $(this).text();
        renderCity(city)
    })
    // render city
    function renderCity(city) {
        var apiKey = "&appid=712bd548fef61a9da60836878da0b06d"
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // console.log(response);
            let cityName = response.name;
            let longitude = response.coord.lon;
            let latitude = response.coord.lat;
            let UV = "";
            let temperatureK = response.main.temp;
            let temperatureF = ((Number(temperatureK) - 273.15) * 1.8) + 32;
            let humidity = response.main.humidity;
            let windSpeed = response.wind.speed;
            renderUV(apiKey,latitude,longitude);
            renderWeather(cityName,temperatureF,humidity,windSpeed);
            renderFiveDay(apiKey,city);
        })
    }
    // grab info about uv
    function renderUV(apiKey,latitude,longitude) {
        let queryUV = "http://api.openweathermap.org/data/2.5/uvi?" + apiKey + "&lat=" + latitude + "&lon=" + longitude;

        $.ajax({
            url: queryUV,
            method: "GET"
        }).then(function(response) {
            // console.log(response);
            UV = response.value;
            $("#uv-index").text("UVI: " + UV);
        })
    }
    // grab info about 5day forecast
    function renderFiveDay (apiKey,city) {
        let queryForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey;
        $.ajax({
            url: queryForecast,
            method: "GET"
        }).then(function(response) {
            $("#forecast").empty();
            // console.log(response);
            for (let i = 7; i <= response.list.length ; i += 8) {
                temperatureK = response.list[i].main.temp;
                temperatureF = ((Number(temperatureK) - 273.15) * 1.8) + 32;
                humidity = response.list[i].main.humidity;
                let dateTime = response.list[i].dt_txt;
                let date = dateTime.split(" ");
                let cityInfo = $("<div>");
                $(cityInfo).addClass("ml-2 pl-2 col-sm-12 col-md-4 col-xl-2 pb-2 mb-2 border");
                $(cityInfo).append("<h4> " + date[0] + "</h4><br>");
                $(cityInfo).append("<h6> Temperature: " + temperatureF.toFixed(2) + "&#8457</h6><br>");
                $(cityInfo).append("<h6> Humidity: " + humidity + "%</h6><br>");
                $("#forecast").append(cityInfo);
            }
            $("#forecastHeader").html("5-Day Forecast")
        })
    }
    // renders current weather
    function renderWeather(cityName,temperatureF,humidity,windSpeed) {
        let cityInfo = $("<div>");
        $(cityInfo).addClass("ml-2 pl-2");
        $(cityInfo).append("<h2>" + cityName + "</h2><br>");
        $(cityInfo).append("<h4> Temperature (F): " + temperatureF.toFixed(2) + "&#8457</h4><br>");
        $(cityInfo).append("<h4> Humidity: " + humidity + "%</h4><br>");
        $(cityInfo).append("<h4> Wind Speed: " + windSpeed + " MPH</h4><br>");
        let UVclass = $("<h4>");
        UVclass.attr("id","uv-index");
        $(cityInfo).append(UVclass);
        $("#currentWeather").html(cityInfo);
    }

    // input event 
    $("button").on("click", function (event) {
        event.preventDefault();
        let newCity = $("#search-input").val().trim();
        // console.log($("#search-input").val());
        // console.log($("#search-input").text());
        cities.push(newCity);
        localStorage.setItem("savedCity", JSON.stringify(cities));
        renderCity(newCity);
        renderSideBar(newCity);
    })
})