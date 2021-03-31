const globalUrl = "http://localhost:3000";

getLocation();
start();
async function start()
{
    let url = `${globalUrl}/favorites`;

    try {
        let response = await fetch(url);
        let commits = await response.json();

        for (let i = 0; i < commits.length; i++)
            loadCity(commits[i].name, commits[i]._id);
    } catch (err) {
        if (err === "401")
            alert('Проблемы с ключом');
        else
        if (err === "404")
            alert('Город не найден');
        else
        if (err === "429")
            alert('Слишком много запросов');
        else
            alert('Произошла ошибка');
    }
}

async function loadCity(nameCity, id) {
    createEmptyElement(nameCity, id);
    let url = `${globalUrl}/weather/city?q=${nameCity}`;

    try{
        let response = await fetch(url);
        let commits = await response.json();

        let temp = ~~commits.main.temp;
        let img = commits.weather[0].icon + '.png';
        let wind = commits.wind.speed;
        let cloud = commits.weather[0].description;
        let press = commits.main.pressure;
        let hum = commits.main.humidity;
        let x = commits.coord.lat.toFixed(1);
        let y = commits.coord.lon.toFixed(1);

        refactorElement(nameCity, temp, img, wind, cloud, press, hum, x, y, id);
    } catch(err) {
        delFast(id);
        alert(`Произошла ошибка при загрузке города: ${nameCity}`);
        console.error(err);
    }
}

async function addNewCity(nameCity = undefined, id) {
    let input_city = document.getElementById('add_city');

    nameCity = input_city.value;
    input_city.value = '';

    if (nameCity === "")
        return;

    let url = `${globalUrl}/weather/city?q=${nameCity}`;

    id = Date.now().toString();
    createEmptyElement(nameCity, id);

    try {
        let response = await fetch(url);
        let commits = await response.json();

        if (commits.cod === "401" || commits.cod === "404" || commits.cod === "429")
            throw commits.cod;

        url = `${globalUrl}/favorites`;

        let res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameCity
            })
        });

        let com = await res.json();

        document.getElementById(id).querySelector(".delete").setAttribute('onclick', "del('" + com._id + "')");
        document.getElementById(id).setAttribute('id', com._id);

        let temp = ~~commits.main.temp;
        let img = commits.weather[0].icon + '.png';
        let wind = commits.wind.speed;
        let cloud = commits.weather[0].description;
        let press = commits.main.pressure;
        let hum = commits.main.humidity;
        let x = commits.coord.lat.toFixed(1);
        let y = commits.coord.lon.toFixed(1);

        refactorElement(nameCity, temp, img, wind, cloud, press, hum, x, y, com._id);
    } catch(err) {
        if (err === "401")
            alert('Проблемы с ключом');
        else
        if (err === "404")
            alert('Город не найден');
        else
        if (err === "429")
            alert('Слишком много запросов');
        else
            alert('Произошла ошибка');
        delFast(id);
    }
}


function refactorElement(city, temperature, img, wind, cloud, pressure, humidity, x, y, id) {
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
        let url = `${globalUrl}/weather/coordinates?lat=${coords.coords.latitude}&lon=${coords.coords.longitude}`;

        try {
            let response = await fetch(url);
            let commits = await response.json();

            let nameCity = commits.name;
            let temp = ~~commits.main.temp;
            let img = commits.weather[0].icon + '.png';
            let wind = commits.wind.speed;
            let cloud = commits.weather[0].description;
            let press = commits.main.pressure;
            let hum = commits.main.humidity;
            let x = commits.coord.lat.toFixed(1);
            let y = commits.coord.lon.toFixed(1);

            refactorTopCity(nameCity, temp, img, wind, cloud, press, hum, x, y);
        } catch(err) {
            if (err === "401")
                alert('Проблемы с ключом');
            else
            if (err === "404")
                alert('Город не найден');
            else
            if (err === "429")
                alert('Слишком много запросов');
            else
                alert('Произошла ошибка');
        }
    }

    async function error({ message }) {
        let url = `${globalUrl}/weather/city?q=Москва`;

        try {
            let response = await fetch(url);
            let commits = await response.json();

            let nameCity = commits.name;
            let temp = ~~commits.main.temp;
            let img = commits.weather[0].icon + '.png';
            let wind = commits.wind.speed;
            let cloud = commits.weather[0].description;
            let press = commits.main.pressure;
            let hum = commits.main.humidity;
            let x = commits.coord.lat.toFixed(1);
            let y = commits.coord.lon.toFixed(1);

            refactorTopCity(nameCity, temp, img, wind, cloud, press, hum, x, y);
        } catch(err) {
            if (err === "401")
                alert('Проблемы с ключом');
            else
            if (err === "404")
                alert('Город не найден');
            else
            if (err === "429")
                alert('Слишком много запросов');
            else
                alert('Произошла ошибка');
        }
        console.error(message);
    }
}

function update() {
    clearTop();
    getLocation();
}

function refactorTopCity(city, temperature, img, wind, cloud, pressure, humidity, x, y) {
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

async function del(idCity) {
    let url = `${globalUrl}/favorites`;

    try {
        await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: idCity
            })
        });
        document.getElementById(idCity).style.display = "none";
    } catch (err) {
        if (err === "401")
            alert('Проблемы с ключом');
        else
        if (err === "404")
            alert('Город не найден');
        else
        if (err === "429")
            alert('Слишком много запросов');
        else
            alert('Произошла ошибка');
    }
}

function delFast(idCity) {
    document.getElementById(idCity).style.display = "none";
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