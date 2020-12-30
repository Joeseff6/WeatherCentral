const searchForm = $(`#searchForm`);
const searchBtn = $(`#searchBtn`);
const searchVal = $(`#searchLocation`)

var cityList = [];
var weatherAPIKey = `e1e7a51f8e49f8c421e774a281377b83`;



searchBtn.click(function() {
    var city = searchVal.val();
    $(`<button>${city}</button>`).appendTo(`#searchHistory`)
    searchForm.submit(function(event) {
        event.preventDefault();
        $(`#city`).text(`City Name: ${city}`)
        $(`#dayHeaderText1`).text(`Day One`)
        $(`#dayHeaderText2`).text(`Day Two`)
        $(`#dayHeaderText3`).text(`Day Three`)
        $(`#dayHeaderText4`).text(`Day Four`)
        $(`#dayHeaderText5`).text(`Day Five`)





        var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${weatherAPIKey}`;

            $.ajax({
                url: forecastURL,
                method: `GET`
            })

                .then(function(response) {
                    console.log(forecastURL)

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
                        tempF = (Object.values(response.list[hourIterator].main)[0]).toFixed(2);
                        humidity = Object.values(response.list[hourIterator].main)[7];
                        windspeed = Object.values(response.list[hourIterator].wind)[0];

                        $(`#icon${i}`).attr(`src`,`https://openweathermap.org/img/wn/${icon}@2x.png`);
                        $(`#date${i}`).text(`Day: ${date}`);
                        $(`#temp${i}`).text(`Temp: ${tempF}\u00B0F`);
                        $(`#humidity${i}`).text(`Humidity: ${humidity}%`);
                        $(`#windSpeed${i}`).text(`Wind Speed: ${windspeed}mph`);

                    
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
