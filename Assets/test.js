const searchBtn = $(`#searchBtn`);
const clearBtn = $(`#clearBtn`);
const searchVal = $(`#searchLocation`);
const searchForm = $(`#searchForm`);
const weatherAPIKey = `e1e7a51f8e49f8c421e774a281377b83`

function getStoredInfo() {

}

function rendorStoredinfo() {

}

function storeInfo() {
    localStorage.setItem(`Search History`, ``);
    localStorage.setItem(`Current City Data`, ``);
    localStorage.setItem(`Five Day Forecast`, ``);
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
        uviCondition = `Extreme`
        uviProperties.backgroundColor = `purple`;
    }

    return uviProperties
}


searchForm.submit(function(event) {
    event.preventDefault()
    let city = searchVal.val()
    if (city) {
        var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}`
    }

    $.ajax({
        url: weatherURL,
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
                })
        })
    
})  
