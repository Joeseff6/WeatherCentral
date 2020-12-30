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

                    let hourIterator = 0;
                    let date = ``;
                    let icon = ``;
                    let tempF = 0;
                    let humidity = 0;
                    let windspeed = 0;
                    let counter = 0;

                    for (let i = 1; i < 16; i++) {
                        icon = Object.values(response.list[hourIterator].weather[0])[3];
                        date = response.list[hourIterator].dt_txt;
                        tempF = ((Object.values(response.list[hourIterator].main)[0]-273.15)*1.8+32).toFixed(2);
                        humidity = Object.values(response.list[hourIterator].main)[7];
                        windspeed = Object.values(response.list[hourIterator].wind)[1];

                        $(`#icon${i}`).attr(`src`,`http://openweathermap.org/img/wn/${icon}@2x.png`);
                        $(`#date${i}`).text(`Day: ${date}`);
                        $(`#temp${i}`).text(`Temp(F): ${tempF}`);
                        $(`#humidity${i}`).text(`Humidity: ${humidity}`);
                        $(`#windSpeed${i}`).text(`Windspeed(m/s): ${windspeed}`);

                    
                        hourIterator += 2
                        counter++
                        if (counter === 3 && hourIterator < 36) {
                            counter = 0
                            hourIterator += 2
                        }



                }


                        console.log(response)




                })























    


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
