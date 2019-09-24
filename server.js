const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

let movies = require('./movies-data-small.json');

let countriesPossible = movies.map(movie => movie.country.toLowerCase());
console.log(countriesPossible);
let genresPossible = movies.map(movie => movie.genre.toLowerCase());
console.log(genresPossible);

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.listen(8000, () => {
  console.log('Listening!');
});

app.get('/movies', (req,res) => {
  let newResults = movies;
  let { genre, country, avg_vote } = req.query;

  if (genre) {
    let lower = genre.toLowerCase();
    if(!genresPossible.includes(lower)) {
      res.status(400).send('Must pick a matching genre');
    }
    newResults = movies.filter(movie => {
      return movie['genre'].toLowerCase() === lower;
    });
  }
  if (country) {
    let lower = country.toLowerCase();
    if(!countriesPossible.includes(lower)) {
      res.status(400).send('Must pick a matching country');
    }
    newResults = movies.filter(movie => {
      return movie['country'].toLowerCase() === lower;
    });
  }
  




  res.send(newResults);
});