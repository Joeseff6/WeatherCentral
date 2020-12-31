const searchForm = $(`#searchForm`);
const searchBtn = $(`#searchBtn`);
const searchVal = $(`#searchLocation`)
var cityList = [];
var weatherAPIKey = `e1e7a51f8e49f8c421e774a281377b83`;

searchBtn.click(function() {
    var city = searchVal.val();
    $(`.forecastSection`).removeClass(`d-none`)
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

                    var lat = Object.values(response.city.coord)[0];
                    var lon = Object.values(response.city.coord)[1];

                    var uviURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}`

                    $.ajax({
                        url: uviURL,
                        method: `GET`
                    })
                        .then(function(response) {
                            let uvi = 0

                            for (let i = 0; i < 5; i++) {
                                uvi = Math.round(Object.values(response.daily[i])[14])
                                uviArrLength = (Object.values(response.daily[i])).length

                                if (uviArrLength === 14) {
                                    uvi = Math.round(Object.values(response.daily[i])[13])
                                }

                                if (uvi <= 2) {
                                    var uviCondition = `Low`
                                } else if (uvi <= 5) {
                                    var uviCondition = `Moderate`
                                } else if (uvi <= 7) {
                                    var uviCondition = `High`
                                } else if (uvi <= 10) {
                                    var uviCondition = `Very High`
                                } else {
                                    var uviCondition = `Extreme`
                                }
    
                                $(`#uviText${i}`).text(`UV Index:`);
                                $(`#uviNumber${i}`).text(uvi);
                                $(`#uviCondition${i}`).text(uviCondition);
                                

                            }
                        })
                })

    })
})