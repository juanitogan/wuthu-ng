////////////////////////////////////////////////////////////////////////////////
// Wuthu Finda - Simple webapp to search for an address and get weather data.
// Mobiquity
////////////////////////////////////////////////////////////////////////////////
// wuthu.js
//     Main controller code.
//
// Matt Jernigan - 28 JAN 2015
////////////////////////////////////////////////////////////////////////////////
angular.module("wuthu", [])

.controller("WuthuController", function ($http) {
    var wuthuCtl = this;

    wuthuCtl.address = ""; //"Springfield";
    wuthuCtl.results = [];
    wuthuCtl.weatherData = "";

    ////////////////////////////////////////////////////////////////////////////
    // Search Functions

    // Execute the search on the address entered.
    wuthuCtl.search = function () {
        wuthuCtl.weatherData = "";
        getAddresses(wuthuCtl.address)
    };

    // Ajax the address search data from Google.
    function getAddresses(searchStr) {
        var req = {
            method: 'GET',
            url:  "//maps.googleapis.com/maps/api/geocode/json",
            params: {
                sensor: false,
                address: searchStr
            },
        };
        $http(req)
        .success(function(data, status, headers, config) {
            displayAddresses(data.results);
        })
        .error(function(data, status, headers, config) {
        })
        ;
    };

    // Format, and display the addresses.
    function displayAddresses(addressData) {
        wuthuCtl.results = addressData;
    };


    ////////////////////////////////////////////////////////////////////////////
    // Weather Functions

    // Fetch, format, and display the weather data.
    wuthuCtl.showWeather = function(addressData) {
        // Radio button feature: Clear all "selected" attributes in the results list.
        wuthuCtl.results.forEach( function(result) {
            result.selected = false;
        });
        // Then set the "selected" attribute on the triggering item.
        addressData.selected = true;
        // Make the ajax call.
        getWeather(addressData.geometry.location.lat, addressData.geometry.location.lng);
    };

    // Ajax the weather data from forecase.io with latitude and longitude.
    function getWeather(lat, lng) {
        var req = {
            method: 'jsonp',
            url:  "https://api.forecast.io/forecast/47a948d362300db9b8856629bd4700ac/"
                    + encodeURIComponent(lat + "," + lng),
            params: {
                callback: "JSON_CALLBACK"
            },
        };
        $http(req)
            .success(function(data, status, headers, config) {
                console.log(data);
                displayWeather(data);
            })
            .error(function(data, status, headers, config) {
            })
        ;
    };

    // Format, and display the weather data.
    function displayWeather(weather) {
        wuthuCtl.weatherData = weather;
    };

    // Returns a CSS class name to decorate the temperature elements.
    wuthuCtl.getTemperatureClass = function(temperature) {
        if (temperature >= 32) {
            return "hot";
        } else if (temperature < 0) {
            return "cold";
        } else {
            return "cool";
        };
    };

})
;
