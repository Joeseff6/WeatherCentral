const searchForm = $(`#searchForm`);
const searchBtn = $(`#searchBtn`);
const searchVal = $(`#searchLocation`)
const clearBtn = $(`#clearBtn`)
var cityList = [];
var weatherAPIKey = `e1e7a51f8e49f8c421e774a281377b83`;
var city = ``

getStoredCities()

function getStoredCities() {
    var listedCities = JSON.parse(localStorage.getItem(`Stored City`))
    if (listedCities !== null) {
        cityList = listedCities
    }
    rendorStoredCities()
}

function rendorStoredCities() {
    for (let i = 0; i < cityList.length; i++) {
        city = cityList[i]
        $(`<button class="remove">${city}</button>`).appendTo(`#searchHistory`)
    }
}

clearBtn.click(function() {
    cityList = []
    localStorage.setItem(`Stored City`, JSON.stringify(cityList));
    $(`.remove`).remove()
})

searchBtn.click(function() {

    city = searchVal.val();
    console.log(city)
    // searchVal.val(``)
    cityList.push(city)
    
    storeCities()

    function storeCities() {
        localStorage.setItem(`Stored City`, JSON.stringify(cityList));
    }

    console.log(cityList)
    $(`.forecastSection`).removeClass(`d-none`)
    $(`<button class="remove">${city}</button>`).appendTo(`#searchHistory`)

    searchForm.submit(function(event) {
        event.preventDefault();
        $(`#city`).text(`City Name: ${city}`)

        var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${weatherAPIKey}`;
                        
        $.ajax({
            url: forecastURL,
            method: `GET`
        })
            .then(function(response) {
                var lat = Object.values(response.city.coord)[0];
                var lon = Object.values(response.city.coord)[1];
                var onecallURL = `https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=${lat}&lon=${lon}&appid=${weatherAPIKey}`
                $.ajax({
                    url: onecallURL,
                    method: `GET`
                })
                    .then(function(response) {
                        // window.open(onecallURL,`_target`)
                        $(`.currentWeatherSection`).removeClass(`d-none`)
                        let currentDate = dayjs().format('MMMM D, YYYY')
                        let currentIcon = Object.values(response.current.weather[0])[3];
                        let currentUvi = Math.round(Object.values(response.current)[8])
                        let uviProperties = {
                            backgroundColor: ``,
                            color: `black`
                        };
                        let uviCondition = ``
                        let currentWeatherType = Object.values(response.current.weather[0])[1]
                        let currentTemp = Object.values(response.current)[3].toFixed(0)
                        let currentHumidity = Object.values(response.current)[6]
                        let currentWindSpeed = Object.values(response.current)[11]

                        uviColor(currentUvi)

                        $(`#currentWeatherType`).text(`The Current Weather Type Is: ${currentWeatherType}`);
                        $(`#currentUviText`).text(`UV Index:`);
                        $(`#currentUviNumber`).text(currentUvi).css(uviProperties);
                        $(`#currentUviCondition`).text(`UV Condition: ${uviCondition}`);
                        $(`#currentTemp`).text(`Temp: ${currentTemp}\u00B0F`);
                        $(`#currentHumidity`).text(`Humidity: ${currentHumidity}%`);
                        $(`#currentWindSpeed`).text(`Wind Speed: ${currentWindSpeed}mph`);
                        $(`#currentWeatherHeader`).text(`Current Weather: Today is ${currentDate}`)
                        $(`#currentIcon`).attr(`src`,`https://openweathermap.org/img/wn/${currentIcon}@2x.png`)

                        let uvi = 0

                        for (let i = 0; i < 5; i++) {
                            uvi = Math.round(Object.values(response.daily[i])[14])
                            uviArrLength = (Object.values(response.daily[i])).length
                            if (uviArrLength === 14) {
                                uvi = Math.round(Object.values(response.daily[i])[13])
                            }
                            uviColor(uvi)
                            $(`#uviText${i}`).text(`UV Index:`);
                            $(`#uviNumber${i}`).text(uvi).css(uviProperties);
                            $(`#uviCondition${i}`).text(uviCondition);
                        }
                        function uviColor(uviParameter) {
                            if (uviParameter <= 2) {
                                uviCondition = `Low`  
                                uviProperties.backgroundColor = `darkgreen`;
                            } else if (uviParameter <= 5) {
                                uviCondition = `Moderate`
                                uviProperties.backgroundColor = `yellow`;
                            } else if (uviParameter <= 7) {
                                uviCondition = `High`
                                uviProperties.backgroundColor = `orange`;
                            } else if (uviParameter <= 10) {
                                uviCondition = `Very High`
                                uviProperties.backgroundColor = `red`;
                            } else {
                                uviCondition = `Extreme`
                                uviProperties.backgroundColor = `purple`;
                            }
                        }
                    })
            })

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
                $(`#dayHeaderText1`).text(`Day One`)
                $(`#dayHeaderText2`).text(`Day Two`)
                $(`#dayHeaderText3`).text(`Day Three`)
                $(`#dayHeaderText4`).text(`Day Four`)
                $(`#dayHeaderText5`).text(`Day Five`)
                for (let i = 1; i < 16; i++) {
                    for (let j = 1; j < 6; j++) {
                        if (j % 2 === 0) {
                            $(`#dayCol${j}`).css(`backgroundColor`,`#ff7777`).css(`border`, `solid black 2px`)
                        } else {
                            $(`#dayCol${j}`).css(`backgroundColor`,`#ff4141`).css(`border`, `solid black 2px`)
                        }
                    }

                    icon = Object.values(response.list[hourIterator].weather[0])[3];
                    date = response.list[hourIterator].dt_txt;
                    tempF = (Object.values(response.list[hourIterator].main)[0]).toFixed(0);
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
            })
    })
})



