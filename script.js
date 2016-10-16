(function (global) {
    "use strict";

    var tempUnit = "F";
    var dateFormat = "YYYY-MM-DD";
    var defaultLat = "59.3446";
    var defaultLon = "18.0237";
    var skycons = new Skycons({
        "color": "black"
    });

    init();

    function init() {
        initStyle();
        getWeatherData(defaultLat, defaultLon);
        eventhandlers();
    }

    function eventhandlers() {
        $('#detailsLinkHeader').on("click", function () {
            window.open("https://blargh-ad1345ce59a51a.sharepoint.com/sites/dev/SharePointWeatherAddIn/", "_blank");
        });
    }

    function initStyle() {
        for (var i = 1; i <= 6; i++) {
            if (i % 2 == 0) {
                $('#day' + i + 'Wrapper').css('background-color', '#abafb3');
            }
        }
    }

    function getWeatherData(lat, lng) {
        var url = "https://api.darksky.net/forecast/6ebbfb6cba7bb3d4c1b0d03800b23abe/".concat(lat).concat(",").concat(lng);
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: function (responseData) {
                initDataTable(responseData);
                //initGraph(responseData);
            }
        });
    }

    function initDataTable(weatherData) {
        console.log(weatherData);
        var locationText = $('#locationHeader');
        var temperatureText = $('#currentTemperature');
        var WeatherSummaryText = $('#currentWeatherSummary');
        var dateText = $('#dateHeader');

        var location = weatherData.timezone.split('/')[1];
        locationText.text(location);

        var currentDate = moment.unix(weatherData.currently.time).format(dateFormat);
        dateText.text(currentDate);
        var temperature = weatherData.currently.temperature;
        if (tempUnit === "C") {
            temperature = ((temperature - 32) * 5) / 9;
        }
        temperature = Math.round(temperature) + "\u00B0".concat(tempUnit);;
        temperatureText.text(temperature);

        var weatherSummary = weatherData.currently.summary;
        WeatherSummaryText.text(weatherSummary);
        skycons.add('currentWeatherIcon', weatherData.currently.icon);
        skycons.play();

        var forecast = weatherData.daily.data.slice(1);
        for (var i = 0; i < forecast.length; i++) {
            var day = moment.unix(forecast[i].time).format("ddd");

            $('#forecastDay' + (i + 1)).text(day);

            var forecastAvgTemp = (forecast[i].temperatureMax + forecast[i].temperatureMin) / 2;
            if (tempUnit === "C") {
                forecastAvgTemp = ((forecastAvgTemp - 32) * 5) / 9;
            }
            forecastAvgTemp = Math.round(forecastAvgTemp);

            forecastAvgTemp = forecastAvgTemp + "\u00B0".concat(tempUnit);
            $('#forecastTemp' + (i + 1)).text(forecastAvgTemp);

            skycons.add('forecasticon' + (i + 1), forecast[i].icon);

        }
        // var weatherTextString = weatherData.currently.summary;
        // weatherText.text(weatherTextString);

        // var ozone = weatherData.currently.ozone;
        // ozoneText.text(ozone);

        // var windSpeed = weatherData.currently.windSpeed;
        // windSpeedText.text(windSpeed);

        // var humidity = weatherData.currently.humidity * 100;
        // humidityText.text(humidity);
        // console.log(humidity);

        // var pressure = weatherData.currently.pressure;
        // pressureText.text(pressure);

        // var windDirection = (weatherData.currently.windBearing / 22.5) + 0.5;
        // var directions = ["North", "North-North East", "North East", "East-North East", "East", "East-South East", "South East", "South-South East", "South", "South-South West", "South West", "West-South West", "West", "West-North West", "North West", "North-North West"]
        // windDirectionText.text(directions[Math.round(windDirection % 16)]);
        // windDirectionDetailText.text(weatherData.currently.windBearing);
    }
})(this);