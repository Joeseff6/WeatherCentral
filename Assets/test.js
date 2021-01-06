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
                    console.log(oneCallURL)
                    console.log(oneCallResponse)
                    let currentTemp = oneCallResponse.current.humidity
                    let currentDate = oneCallResponse.current.dt
                    
                })
        })
    
})  
