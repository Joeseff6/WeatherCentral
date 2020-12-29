const searchForm = $(`#searchForm`);
const searchBtn = $(`#searchBtn`);
const searchVal = $(`#searchLocation`)

var cityList = [];
var weatherAPIKey = `e1e7a51f8e49f8c421e774a281377b83`;



searchBtn.click(function() {
    searchForm.submit(function(event) {
        event.preventDefault();
        var city = searchVal.val();
        $(`#city`).text(`City Name: ${city}`)
        var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherAPIKey}`;
        var locationURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}`
        
        $.ajax({
            url: locationURL,
            method: `GET`
        })
            .then (function(response) {
                var lon = response.coord.lon;
                var lat = response.coord.lat
                var lonlatArr = [lon,lat]
                return lonlatArr
            })

            // console.log(lon)
            // console.log(lat)
            console.log(lonlatArr)


        // var uviURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}`
        
        getResponse()

        function getResponse() {
            $.ajax({
                url: forecastURL,
                method: `GET`
            })
            


            // $.ajax({
            //     url: uviURL,
            //     method: `GET`
            // })

            .then(function(response) {
                let date = response.list[0].dt_txt;
                let icon = Object.values(response.list[0].weather[0])[3]
                let tempF = (parseInt(Object.values(response.list[0].main[0])[0])-273.15)*1.8+32;
                let humidity = Object.values(response.list[0].main[0])[7]
                let windspeed = Object.values(response.list[0].wind[0])[0]

                console.log(response)
                console.log(date)
                console.log(icon)
                console.log(tempF)
                console.log(humidity)
                console.log(windspeed)



            })
        }
    })
})

// function getInfo() {
//     let hourIterator = 0;
//     let weatherArr = [];
//     let mainArr = [];
//     for (let i = 0; i < 16; i++) {
//         let icon = response.list.weather.icon
//     }
// }
