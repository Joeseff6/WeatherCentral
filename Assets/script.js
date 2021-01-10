// Set constant variables
const searchBtn = $(`#searchBtn`);
const clearBtn = $(`#clearBtn`);
const searchVal = $(`#searchLocation`);
const searchForm = $(`#searchForm`);
const weatherAPIKey = `e1e7a51f8e49f8c421e774a281377b83`;
const searchHistory = $(`#searchHistory`);

// Set other variables
var searchItems = [];
var currentCityInfo = [];
var fiveDayInfo = [];

// Get local storage on page refresh/load
getStoredInfo();

// ------------------- Functions -------------------

function getStoredInfo() {
    // Obtain locally stored info for search history, current weather information, and forecasted weather information
    var storedSearchItems = JSON.parse(localStorage.getItem(`Search Items`));
    if (storedSearchItems !== null) {
        searchItems = storedSearchItems;
    }

    // Class d-none removed from the current and forecasted weather sections for visibility on page refresh/load
    var storedCurrentCityInfo = JSON.parse(localStorage.getItem(`Current City Info`));
    if (storedCurrentCityInfo !== null) {
        currentCityInfo = storedCurrentCityInfo;
        $(`.currentWeatherSection`).removeClass(`d-none`);
    } 

    var storedFiveDayInfo = JSON.parse(localStorage.getItem(`Five Day Info`));
    if (storedFiveDayInfo !== null) {
        fiveDayInfo = storedFiveDayInfo;
        $(`.forecastSection`).removeClass(`d-none`);
    }
    
    // Rendor items obtained from local storage
    rendorStoredInfo();
}

function rendorStoredInfo() {
    // Rendor stored search History as buttons
    for (i = 0; i < searchItems.length; i++) {
        var btn = $(`<button>`);
        btn.attr(`class`,`searchItem btn btn-info mx-0 my-0`).text(searchItems[i]);
        searchHistory.append(btn);
    }

    // Variables below are obtained from function ajaxCall, which uses the data retrieved from servers to create these variables.
    // Rendor current city weather information
    if (currentCityInfo[0]) {
        $(`#city`).text(`City Name: ${currentCityInfo[0]}`);
    } else {
        $(`#city`).text(`City Name: Pick a City!`);
    }
    $(`#currentWeatherHeader`).text(`The Current Weather! Today is ${currentCityInfo[1]}`)
    $(`#currentIcon`).attr(`src`, `https://openweathermap.org/img/wn/${currentCityInfo[2]}@2x.png`);
    $(`#currentWeatherType`).text(`Weather Type: ${currentCityInfo[3]}`);
    $(`#currentUviText`).text(`UV Index:`);
    let uviNumber = currentCityInfo[4];
    let uviProperties = uviDescriptor(uviNumber);
    $(`#currentUviNumber`).text(uviNumber).css(uviProperties);
    $(`#currentUviCondition`).text(`UV Condition: ${currentCityInfo[5]}`);
    $(`#currentTemp`).text(`Temperature: ${currentCityInfo[6]}\u00B0F`);
    $(`#currentHumidity`).text(`Humidity: ${currentCityInfo[7]}%`);
    $(`#currentWindSpeed`).text(`Windspeed: ${currentCityInfo[8]}mph`);

    // Rendor forecasted weather information
    let dayIterator = 1;
    for (i = 0; i < fiveDayInfo.length; i++) {
        $(`#date${dayIterator}`).text(`${fiveDayInfo[i].date}`);
        $(`#icon${dayIterator}`).attr(`src`,`https://openweathermap.org/img/wn/${fiveDayInfo[i].icon}@2x.png`);
        $(`#weather${dayIterator}`).text(`Weather: ${fiveDayInfo[i].weather}`);
        $(`#uviText${dayIterator}`).text(`UV Index:`);
        let uviProperties = uviDescriptor(`${fiveDayInfo[i].uviNumber}`);
        $(`#uviNumber${dayIterator}`).text(`${fiveDayInfo[i].uviNumber}`).css(uviProperties);
        $(`#uviCondition${dayIterator}`).text(`Cond: ${uviProperties.uviCondition}`);
        $(`#temp${dayIterator}`).text(`Temp: ${fiveDayInfo[i].temp}\u00B0F`);
        $(`#humidity${dayIterator}`).text(`Humidity: ${fiveDayInfo[i].humidity}%`);
        $(`#windSpeed${dayIterator}`).text(`Wind: ${fiveDayInfo[i].windSpeed}mph`);
        dayIterator++;
    }
}

// Stores search history and current/forecast information into local storage for data persistence.
function storeInfo() {
    localStorage.setItem(`Search Items`, JSON.stringify(searchItems));
    localStorage.setItem(`Current City Info`, JSON.stringify(currentCityInfo));
    localStorage.setItem(`Five Day Info`, JSON.stringify(fiveDayInfo));
}

// Adds a button to the search history when initialized
function addSearch() {
    const btn = $(`<button>`);
    // If button text is blank (obtained from search value), this code will not run. Use to prevent adding buttons clicking search history.
    if (searchVal.val() !== ``) {
        btn.attr(`class`,`searchItem btn btn-info mx-0 my-0`).text(searchVal.val());
        searchHistory.append(btn);
        searchItems.push(searchVal.val());
        storeInfo();
    }
}

// Function used for styling and providing a condition string when a UVI number is passed
function uviDescriptor(uvi) {
    let uviProperties = {
        uviCondition: ``,
        backgroundColor: ``,
        color: `black`
    }
    if (uvi <= 2) {
        uviProperties.uviCondition = `Favorable`;
        uviProperties.backgroundColor = `darkgreen`;
    } else if (uvi <= 5) {
        uviProperties.uviCondition = `Moderate`;
        uviProperties.backgroundColor = `yellow`;
    } else if (uvi <= 7) {
        uviProperties.uviCondition = `Severe`;
        uviProperties.backgroundColor = `orange`;
    } else if (uvi <= 10) {
        uviProperties.uviCondition = `Exercise Caution`;
        uviProperties.backgroundColor = `red`;
    } else {
        uviProperties.uviCondition = `Extreme`;
        uviProperties.backgroundColor = `purple`;
    }

    return uviProperties;
}

// jQuery method to request information from servers
function ajaxCall(apiUrl,city) {
    // First method to pull server information for latitude and longitude
    $.ajax({
        url: apiUrl,
        method: `GET`
    })
        // If retrieval fails, the remaining code will not run. Displays a message in the search box
        .fail(function() {
            searchVal.val(`Not found!`);
        })
        // If retrieval succeeds, the rest of the function will run
        .then(function(weatherResponse) {
            $(`#city`).text(`City Name: ${city}`);
            // Push user input for data persistence
            currentCityInfo = [];
            currentCityInfo.push(city);

            // Add input to search history
            addSearch();
            
            searchVal.val(``);
            var lat = weatherResponse.coord.lat;
            var lon = weatherResponse.coord.lon;
            var oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${weatherAPIKey}`;

            // Second method to pull current/forecasted weather information using latitude and longitude
            $.ajax({
                url: oneCallURL,
                method: `GET`
            })
                .then(function(oneCallResponse) {
                    // Dynamically change text on the page, loading current weather information
                    $(`.currentWeatherSection`).removeClass(`d-none`);
                    let currentDateObj = dayjs.unix(oneCallResponse.current.dt);
                    $(`#currentWeatherHeader`).text(`The Current Weather! Today is ${currentDateObj.$M+1}/${currentDateObj.$D}/${currentDateObj.$y}`);
                    $(`#currentIcon`).attr(`src`, `https://openweathermap.org/img/wn/${oneCallResponse.current.weather[0].icon}@2x.png`);
                    $(`#currentWeatherType`).text(`Weather Type: ${oneCallResponse.current.weather[0].description}`);
                    $(`#currentUviText`).text(`UV Index:`);
                    let uviNumber = Math.round(oneCallResponse.current.uvi);
                    let uviProperties = uviDescriptor(uviNumber);
                    $(`#currentUviNumber`).text(uviNumber).css(uviProperties);
                    $(`#currentUviCondition`).text(`UV Condition: ${uviProperties.uviCondition}`);
                    $(`#currentTemp`).text(`Temperature: ${Math.round(oneCallResponse.current.temp)}\u00B0F`);
                    $(`#currentHumidity`).text(`Humidity: ${Math.round(oneCallResponse.current.humidity)}%`);
                    $(`#currentWindSpeed`).text(`Windspeed: ${Math.round(oneCallResponse.current.wind_speed)}mph`);
                    // Pushing values into an Array for data persistence
                    currentCityInfo.push(`${currentDateObj.$M+1}/${currentDateObj.$D}/${currentDateObj.$y}`, `${oneCallResponse.current.weather[0].icon}`, `${oneCallResponse.current.weather[0].description}`, `${Math.round(oneCallResponse.current.uvi)}`, `${uviProperties.uviCondition}`, `${Math.round(oneCallResponse.current.temp)}`, `${Math.round(oneCallResponse.current.humidity)}`, `${Math.round(oneCallResponse.current.wind_speed)}`);
                    // Stores current weather information using currentCityInfo
                    storeInfo();

                    // Dynamically change text on the page, loading forecasted weather information
                    var forecastArr = [];
                    $(`.forecastSection`).removeClass(`d-none`);
                    for (let i = 1; i < 6; i++) {
                        let dateObj = dayjs.unix(oneCallResponse.daily[i].dt);
                        $(`#date${i}`).text(`${dateObj.$M+1}/${dateObj.$D}/${dateObj.$y}`);
                        $(`#icon${i}`).attr(`src`,`https://openweathermap.org/img/wn/${oneCallResponse.daily[i].weather[0].icon}@2x.png`);
                        $(`#weather${i}`).text(`Weather: ${oneCallResponse.daily[i].weather[0].description}`);
                        $(`#uviText${i}`).text(`UV Index:`);
                        let uviProperties = uviDescriptor(Math.round(oneCallResponse.daily[i].uvi));
                        $(`#uviNumber${i}`).text(Math.round(oneCallResponse.daily[i].uvi)).css(uviProperties);
                        $(`#uviCondition${i}`).text(`Cond: ${uviProperties.uviCondition}`);
                        $(`#temp${i}`).text(`Temp: ${Math.round(oneCallResponse.daily[i].temp.day)}\u00B0F`);
                        $(`#humidity${i}`).text(`Humidity: ${oneCallResponse.daily[i].humidity}%`);
                        $(`#windSpeed${i}`).text(`Wind: ${Math.round(oneCallResponse.daily[i].wind_speed)}mph`);

                        // An object used to store properties for data persistence
                        let forecastObj = {
                            date: `${dateObj.$M+1}/${dateObj.$D}/${dateObj.$y}`,
                            icon: `${oneCallResponse.daily[i].weather[0].icon}`,
                            weather: `${oneCallResponse.daily[i].weather[0].description}`,
                            uviText: `UV Index:`,
                            uviNumber: `${Math.round(oneCallResponse.daily[i].uvi)}`,
                            temp: `${Math.round(oneCallResponse.daily[i].temp.day)}`,
                            humidity: `${oneCallResponse.daily[i].humidity}`,
                            windSpeed: `${Math.round(oneCallResponse.daily[i].wind_speed)}`
                        }
                        // Above object is pushed into an array for each iteration
                        forecastArr.push(forecastObj);
                    }
                    // The array of objects is assigned onto a variable and stored into local storage
                    fiveDayInfo = forecastArr;
                    storeInfo();
                })
        })
    
}

// ------------------- Event Listeners using above functions -------------------

// Functionality when search form is submitted, or search button is clicked
searchForm.submit(function(event) {
    event.preventDefault();
    var city = searchVal.val();
    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}`;
    ajaxCall(weatherURL,city);
})

// Functionality when dynamically added buttons (search history items) are clicked
$(document).on(`click`,`.searchItem`,function() {
    var city = $(this).text();
    $(`#city`).text(`City Name: ${city}`);
    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}`;
    ajaxCall(weatherURL,city);
})

// Functionality when the clear button is clicked.
clearBtn.click(function() {
    $(`.searchItem`).remove()
    localStorage.removeItem(`Search Items`);
    localStorage.removeItem(`Current City Info`);
    localStorage.removeItem(`Five Day Info`);
})