const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const https = require('https');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const url = 'mongodb+srv://dbU:dbUP@cluster0.jwiaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err)
        console.error(err);
});

app.use(cors());

const citySchema = new mongoose.Schema ({
    _id: String,
    name: String
});

const city = mongoose.model('city', citySchema);

app.get('/favorites', (req, res) => {
    city.find().exec((err, cities) => {
        if (err)
            res.status(400).send(err);

        if (cities)
            res.status(200).send(cities);
    });
});

app.post('/favorites', (req, res) => {
    const cityId = Date.now().toString();

    let favorite = new city({
        _id: cityId,
        name: req.body.name
    });

    favorite.save(err => {
        if (err)
            res.status(400).send(err);
        else
            res.send({_id: cityId});
    });
});

app.delete('/favorites', (req, res) => {
    city.deleteOne({_id: req.body.id}, (err) => {
        if (err)
            res.status(400).send(err);
        else
            res.sendStatus(200);
    });
});

app.get('/weather/city', (req, res) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${req.query.q}&appid=37806c6a2292ccb85ae1a76932369592&units=metric&lang=ru`;

    https.get(url, (resp) => {
        if (resp.statusCode === 404) {
            res.status(404).send("City not found");
        } else {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                data = JSON.parse(data);
                res.status(200).send(data);
            })
        }
    }).on("error", (err) => {
        res.status(err).send("City not found");
    })
})

app.get('/weather/coordinates', (req, res) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${req.query.lat}&lon=${req.query.lon}&appid=37806c6a2292ccb85ae1a76932369592&units=metric&lang=ru`;

    https.get(url, (resp) => {
        if (resp.statusCode === 404) {
            res.status(404).send("City not found");
        } else {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                data = JSON.parse(data);
                res.status(200).send(data);
            })
        }
    }).on("error", (err) => {
        res.status(err).send("City not found");
    })
})

app.listen(3000, () => console.log(`Weather app listening on port 3000.`));