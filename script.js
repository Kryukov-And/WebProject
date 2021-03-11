if (localStorage.getItem('globalId') == null)
    localStorage.setItem('globalId', '0');

getLocation();

for (let i = 0; i < Number.parseInt(localStorage.getItem('globalId')); i++)
    addNewCity(localStorage.getItem('id' + i.toString()), true, 'id' + i.toString());

async function addNewCity(nameCity = undefined, load=false, id) {
    if (nameCity === null)
        return;

    let myKey = '37806c6a2292ccb85ae1a76932369592';
    let input_city = document.getElementById('add_city');

    if (nameCity === undefined){
        nameCity = input_city.value;
        input_city.value = '';
    }

    if (nameCity === "")
        return;

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${nameCity}&appid=${myKey}&units=metric&lang=ru`;

    if (load)
        createEmptyElement(nameCity, id);
    else
    {
        id = Date.now().toString();
        createEmptyElement(nameCity, id);
    }

    let response = await fetch(url).catch(err => {
        alert('Произошла ошибка при запросе')
        del(id);
    });

    let commits = await response.json();

    if (commits.cod === "401"){
        alert('Проблемы с ключом');
        del(id);
        return;
    }

    if (commits.cod === "404"){
        alert('Нет информации об этом городе');
        del(id);
        return;
    }

    if (commits.cod === "429"){
        alert('Запросы в минуту превышают лимит бесплатного аккаунта');
        del(id);
        return;
    }

    if (!load){
        let l = localStorage.getItem('globalId');
        l = Number.parseInt(l);
        localStorage.setItem('id' + l, nameCity);
        localStorage.setItem('globalId', (l + 1).toString());
        document.getElementById(id).setAttribute('id', 'id' + l);
        id = 'id' + l;
        document.getElementById(id).querySelector(".delete").setAttribute('onclick', "del('" + id + "')");
    }

    let temp = ~~commits.main.temp;
    let img = commits.weather[0].icon + '.png';
    let wind = commits.wind.speed;
    let cloud = commits.weather[0].description;
    let press = commits.main.pressure;
    let hum = commits.main.humidity;
    let x = commits.coord.lon.toFixed(1);
    let y = commits.coord.lat.toFixed(1);

    refactorElement(nameCity, temp, img, wind, cloud, press, hum, x, y, id);
}


function refactorElement(city, temperature, img, wind, cloud, pressure, humidity, y, x, id) {
    let newFavorite = document.getElementById(id);
    newFavorite.querySelector('h3').textContent = city;
    newFavorite.querySelector('.temperature').textContent = temperature.toString()+'°C';
    newFavorite.querySelector('img').setAttribute('src', 'imgs/' + img);
    newFavorite.querySelector('.wind .normal').textContent = wind.toString() + ' м/c';
    newFavorite.querySelector('.cloud .normal').textContent = cloud;
    newFavorite.querySelector('.pressure .normal').textContent = pressure.toString() + ' мм';
    newFavorite.querySelector('.humidity .normal').textContent = humidity.toString() + '%';
    newFavorite.querySelector('.cords .normal').textContent = '[' + x.toString() + ', ' + y.toString() +']';

}

function getLocation() {
    navigator.geolocation.getCurrentPosition(success, error);
    async function success(coords) {
        let x = coords.coords.latitude;
        let y = coords.coords.longitude;

        let myKey = '37806c6a2292ccb85ae1a76932369592';
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${x}&lon=${y}&appid=${myKey}&units=metric&lang=ru`;

        let response = await fetch(url);
        let commits = await response.json();

        if (commits.cod === "401"){
            alert('Проблемы с ключом');
            return;
        }

        if (commits.cod === "404"){
            alert('Нет информации об этом городе');

            url = `https://api.openweathermap.org/data/2.5/weather?q=Москва&appid=${myKey}&units=metric&lang=ru`;
            response = await fetch(url);
            commits = await response.json();
        }

        if (commits.cod === "429"){
            alert('Запросы в минуту превышают лимит бесплатного аккаунта');
            return;
        }


        let nameCity = commits.name;
        let temp = ~~commits.main.temp;
        let img = commits.weather[0].icon + '.png';
        let wind = commits.wind.speed;
        let cloud = commits.weather[0].description;
        let press = commits.main.pressure;
        let hum = commits.main.humidity;
        x = commits.coord.lon.toFixed(1);
        y = commits.coord.lat.toFixed(1);

        refactorTopCity(nameCity, temp, img, wind, cloud, press, hum, x, y);
    }

    async function error({ message }) {
        let myKey = '37806c6a2292ccb85ae1a76932369592';
        let url = `https://api.openweathermap.org/data/2.5/weather?q=Москва&appid=${myKey}&units=metric&lang=ru`;
        let response = await fetch(url);
        let commits = await response.json();

        if (commits.cod === "401"){
            alert('Проблемы с ключом');
            return;
        }

        if (commits.cod === "429"){
            alert('Запросы в минуту превышают лимит бесплатного аккаунта');
            return;
        }

        let nameCity = commits.name;
        let temp = ~~commits.main.temp;
        let img = commits.weather[0].icon + '.png';
        let wind = commits.wind.speed;
        let cloud = commits.weather[0].description;
        let press = commits.main.pressure;
        let hum = commits.main.humidity;
        x = commits.coord.lon.toFixed(1);
        y = commits.coord.lat.toFixed(1);

        refactorTopCity(nameCity, temp, img, wind, cloud, press, hum, x, y);

        console.error(message);
    }
}

function update() {
    clearTop();
    getLocation();
}

function refactorTopCity(city, temperature, img, wind, cloud, pressure, humidity, y, x) {
    let newFavorite = document.querySelector('.geo');
    newFavorite.querySelector('h2').textContent = city;
    newFavorite.querySelector('.temperature').textContent = temperature.toString()+'°C';
    newFavorite.querySelector('img').setAttribute('src', 'imgs/' + img);
    newFavorite.querySelector('.wind .normal').textContent = wind.toString() + ' м/c';
    newFavorite.querySelector('.cloud .normal').textContent = cloud;
    newFavorite.querySelector('.pressure .normal').textContent = pressure.toString() + ' мм';
    newFavorite.querySelector('.humidity .normal').textContent = humidity.toString() + '%';
    newFavorite.querySelector('.cords .normal').textContent = '[' + x.toString() + ', ' + y.toString() +']';

}

function clearTop() {
    let city = document.querySelector('.geo');
    city.querySelector('h2').textContent = "Данные загружаются";
    city.querySelector('.temperature').textContent = "";
    city.querySelector('img').setAttribute('src', 'imgs/unknown.png');
    city.querySelector('.wind .normal').textContent = "...";
    city.querySelector('.cloud .normal').textContent = "...";
    city.querySelector('.pressure .normal').textContent = "...";
    city.querySelector('.humidity .normal').textContent = "...";
    city.querySelector('.cords .normal').textContent = "...";
}

function createEmptyElement(city, id) {
    let list = document.querySelector('.favorites');

    let newFavorite = tempCity.content.cloneNode(true);
    newFavorite.querySelector('.favorite').setAttribute('id', id);
    newFavorite.querySelector('.delete').setAttribute('onclick', "del('" + id + "')");
    list.appendChild(newFavorite);
}

function del(idCity) {
    document.getElementById(idCity).style.display = "none";
    localStorage.removeItem(idCity);
}

document.getElementById("myForm")
    .addEventListener("submit", function(event) {
        event.preventDefault();
        addNewCity();
    });

document.getElementById("refresh")
    .addEventListener("click", function(event) {
        event.preventDefault();
        update();
    });
