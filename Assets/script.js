const searchBtn = $(`#searchBtn`);
const clearBtn = $(`#clearBtn`);
const searchVal = $(`#searchLocation`);
const searchForm = $(`#searchForm`);
const weatherAPIKey = `e1e7a51f8e49f8c421e774a281377b83`
const searchHistory = $(`#searchHistory`)
var searchItems = []
var currentCityInfo = []
var fiveDayInfo = []

getStoredInfo()

function getStoredInfo() {
    var storedSearchItems = JSON.parse(localStorage.getItem(`Search Items`))
    if (storedSearchItems !== null) {
        searchItems = storedSearchItems;
    }

    var storedCurrentCityInfo = JSON.parse(localStorage.getItem(`Current City Info`))
    if (storedCurrentCityInfo !== null) {
        currentCityInfo = storedCurrentCityInfo
        $(`.currentWeatherSection`).removeClass(`d-none`)
    }

    var storedFiveDayInfo = JSON.parse(localStorage.getItem(`Five Day Info`))
    if (storedFiveDayInfo !== null) {
        fiveDayInfo = storedFiveDayInfo
        $(`.forecastSection`).removeClass(`d-none`)
    }

    console.log(fiveDayInfo)

    rendorStoredInfo()
}

function rendorStoredInfo() {
    for (i = 0; i < searchItems.length; i++) {
        var btn = $(`<button>`);
        btn.attr(`class`,`searchItem btn btn-info mx-0 my-0`).text(searchItems[i])
        searchHistory.append(btn)
    }

    $(`#city`).text(`City Name: ${currentCityInfo[0]}`);
    $(`#currentWeatherHeader`).text(`The Current Weather! Today is ${currentCityInfo[1]}`)
    $(`#currentIcon`).attr(`src`, `https://openweathermap.org/img/wn/${currentCityInfo[2]}@2x.png`);
    $(`#currentWeatherType`).text(`Weather Type: ${currentCityInfo[3]}`);
    $(`#currentUviText`).text(`UV Index:`);
    let uviNumber = currentCityInfo[4];
    let uviProperties = uviDescriptor(uviNumber)
    $(`#currentUviNumber`).text(uviNumber).css(uviProperties)
    $(`#currentUviCondition`).text(`UV Condition: ${currentCityInfo[5]}`)
    $(`#currentTemp`).text(`Temperature: ${currentCityInfo[6]}\u00B0F`)
    $(`#currentHumidity`).text(`Humidity: ${currentCityInfo[7]}%`)
    $(`#currentWindSpeed`).text(`Windspeed: ${currentCityInfo[8]}mph`)

    let dayIterator = 1;
    for (i = 0; i < fiveDayInfo.length; i++) {
        $(`#date${dayIterator}`).text(`${fiveDayInfo[i].date}`)
        $(`#icon${dayIterator}`).attr(`src`,`https://openweathermap.org/img/wn/${fiveDayInfo[i].icon}@2x.png`)
        $(`#weather${dayIterator}`).text(`Weather: ${fiveDayInfo[i].weather}`)
        $(`#uviText${dayIterator}`).text(`UV Index:`)
        let uviProperties = uviDescriptor(`${fiveDayInfo[i].uviNumber}`)
        $(`#uviNumber${dayIterator}`).text(`${fiveDayInfo[i].uviNumber}`).css(uviProperties)
        $(`#uviCondition${dayIterator}`).text(`Cond: ${uviProperties.uviCondition}`)
        $(`#temp${dayIterator}`).text(`Temp: ${fiveDayInfo[i].temp}\u00B0F`)
        $(`#humidity${dayIterator}`).text(`Humidity: ${fiveDayInfo[i].humidity}%`)
        $(`#windSpeed${dayIterator}`).text(`Wind: ${fiveDayInfo[i].windSpeed}mph`)
        dayIterator++
    }
}

function addSearch() {
    const btn = $(`<button>`);
    btn.attr(`class`,`searchItem btn btn-info mx-0 my-0`).text(searchVal.val())
    searchHistory.append(btn)
    searchItems.push(searchVal.val())
    storeInfo()    
}

function storeInfo() {
    localStorage.setItem(`Search Items`, JSON.stringify(searchItems));
    localStorage.setItem(`Current City Info`, JSON.stringify(currentCityInfo));
    localStorage.setItem(`Five Day Info`, JSON.stringify(fiveDayInfo));
}

function uviDescriptor(uvi) {
    let uviProperties = {
        uviCondition: ``,
        backgroundColor: ``,
        color: `black`
    }

    if (uvi <= 2) {
        uviProperties.uviCondition = `Favorable`  
        uviProperties.backgroundColor = `darkgreen`;
    } else if (uvi <= 5) {
        uviProperties.uviCondition = `Moderate`
        uviProperties.backgroundColor = `yellow`;
    } else if (uvi <= 7) {
        uviProperties.uviCondition = `Severe`
        uviProperties.backgroundColor = `orange`;
    } else if (uvi <= 10) {
        uviProperties.uviCondition = `Exercise Caution`
        uviProperties.backgroundColor = `red`;
    } else {
        uviProperties.uviCondition = `Extreme`
        uviProperties.backgroundColor = `purple`;
    }

    return uviProperties
}

function ajaxCall(apiUrl) {
    $.ajax({
        url: apiUrl,
        method: `GET`
    })
        .then(function(weatherResponse) {
            var lat = weatherResponse.coord.lat
            var lon = weatherResponse.coord.lon
            
            var oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${weatherAPIKey}`
            $.ajax({
                url: oneCallURL,
                method: `GET`
            })
                .then(function(oneCallResponse) {
                    $(`.currentWeatherSection`).removeClass(`d-none`)
                    console.log(oneCallURL)
                    console.log(oneCallResponse)
                    let currentDateObj = dayjs.unix(oneCallResponse.current.dt)
                    $(`#currentWeatherHeader`).text(`The Current Weather! Today is ${currentDateObj.$M+1}/${currentDateObj.$D}/${currentDateObj.$y}`)
                    $(`#currentIcon`).attr(`src`, `https://openweathermap.org/img/wn/${oneCallResponse.current.weather[0].icon}@2x.png`);
                    $(`#currentWeatherType`).text(`Weather Type: ${oneCallResponse.current.weather[0].description}`);
                    $(`#currentUviText`).text(`UV Index:`);
                    let uviNumber = Math.round(oneCallResponse.current.uvi);
                    let uviProperties = uviDescriptor(uviNumber)
                    $(`#currentUviNumber`).text(uviNumber).css(uviProperties)
                    $(`#currentUviCondition`).text(`UV Condition: ${uviProperties.uviCondition}`)
                    $(`#currentTemp`).text(`Temperature: ${Math.round(oneCallResponse.current.temp)}\u00B0F`)
                    $(`#currentHumidity`).text(`Humidity: ${Math.round(oneCallResponse.current.humidity)}%`)
                    $(`#currentWindSpeed`).text(`Windspeed: ${Math.round(oneCallResponse.current.wind_speed)}mph`)
                    currentCityInfo.push(`${currentDateObj.$M+1}/${currentDateObj.$D}/${currentDateObj.$y}`, `${oneCallResponse.current.weather[0].icon}`, `${oneCallResponse.current.weather[0].description}`, `${Math.round(oneCallResponse.current.uvi)}`, `${uviProperties.uviCondition}`, `${Math.round(oneCallResponse.current.temp)}`, `${Math.round(oneCallResponse.current.humidity)}`, `${Math.round(oneCallResponse.current.wind_speed)}`)

                    storeInfo()

                    var forecastArr = []

                    $(`.forecastSection`).removeClass(`d-none`)
                    for (let i = 1; i < 6; i++) {
                        let dateObj = dayjs.unix(oneCallResponse.daily[i].dt)
                        $(`#date${i}`).text(`${dateObj.$M+1}/${dateObj.$D}/${dateObj.$y}`)
                        $(`#icon${i}`).attr(`src`,`https://openweathermap.org/img/wn/${oneCallResponse.daily[i].weather[0].icon}@2x.png`)
                        $(`#weather${i}`).text(`Weather: ${oneCallResponse.daily[i].weather[0].description}`)
                        $(`#uviText${i}`).text(`UV Index:`)
                        let uviProperties = uviDescriptor(Math.round(oneCallResponse.daily[i].uvi))
                        $(`#uviNumber${i}`).text(Math.round(oneCallResponse.daily[i].uvi)).css(uviProperties)
                        $(`#uviCondition${i}`).text(`Cond: ${uviProperties.uviCondition}`)
                        $(`#temp${i}`).text(`Temp: ${Math.round(oneCallResponse.daily[i].temp.day)}\u00B0F`)
                        $(`#humidity${i}`).text(`Humidity: ${oneCallResponse.daily[i].humidity}%`)
                        $(`#windSpeed${i}`).text(`Wind: ${Math.round(oneCallResponse.daily[i].wind_speed)}mph`)

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

                        forecastArr.push(forecastObj)
                    }

                    fiveDayInfo = forecastArr
                    storeInfo()
                })
        })
    
}

searchForm.submit(function(event) {
    event.preventDefault()

    let city = searchVal.val()
    if (city) {
        var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}`
        $(`#city`).text(`City Name: ${city}`);
        currentCityInfo = []
        currentCityInfo.push(city)
        addSearch()
        searchVal.val(``)
    }

    ajaxCall(weatherURL)
})

$(document).on(`click`,`.searchItem`,function() {
    var city = $(this).text()
    if (city) {
        var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}`
        $(`#city`).text(`City Name: ${city}`);
        currentCityInfo = []
        currentCityInfo.push(city)
        fiveDayInfo = []
    }

    ajaxCall(weatherURL)
})

clearBtn.click(function() {
    $(`.searchItem`).remove()
    searchItems = [];
    currentCityInfo = [];
    fiveDayInfo = [];
    localStorage.setItem(`Search Items`,JSON.stringify(searchItems));
    localStorage.setItem(`Current City Info`,JSON.stringify(currentCityInfo));
    localStorage.setItem(`Five Day Info`,JSON.stringify(fiveDayInfo));
})