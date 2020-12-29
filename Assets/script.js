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

            $.ajax({
                url: forecastURL,
                method: `GET`
            })

                .then(function(response) {
                    let date = response.list[0].dt_txt;
                    let icon = Object.values(response.list[0].weather[0])[3];
                    let tempF = ((Object.values(response.list[0].main)[0]-273.15)*1.8+32).toFixed(2);
                    let humidity = Object.values(response.list[0].main)[7]
                    let windspeed = Object.values(response.list[0].wind)[0]

                    console.log(response)




                })
























        // var locationURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}`
        
        // $.ajax({
        //     url: locationURL,
        //     method: `GET`
        // })

    


        // var uviURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}`
        


            


            // $.ajax({
            //     url: uviURL,
            //     method: `GET`
            // })


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
