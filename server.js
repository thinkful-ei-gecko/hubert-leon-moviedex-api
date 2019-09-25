require('dotenv').config();
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

let movies = require('./movies-data-small.json');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.listen(8000, () => {
  console.log('Listening!');
});

// bfa3113a-df04-11e9-8a34-2a2ae2dbcce4
app.use(function validateBearerToken(req, res, next) {
  const getToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;

  if(!getToken || getToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized Request'})
  }
  console.log('Validate bearer token')
  next();
})


app.get('/movies', (req,res) => {
  let newResults = movies;

  const distinct = (value, index, self) => { return self.indexOf(value) === index };
  let countriesPossible = movies.map(movie => movie.country.toLowerCase()).filter(distinct);
  let genresPossible = movies.map(movie => movie.genre.toLowerCase()).filter(distinct);
  let { genre, country, avg_vote } = req.query;

  console.log(countriesPossible)

  function populateResults(queue, querySelection) {
    let lower = queue.toLowerCase();

    if ((querySelection === 'genre' && !genresPossible.includes(lower))
        || (querySelection === 'country' && !countriesPossible.includes(lower))) {
        res.status(400).send(`Must pick a matching ${querySelection}`);
    }      
      newResults = newResults.filter(movie => {
        return movie[`${querySelection}`].toLowerCase() === lower;
      });

  }
  if(genre) {
    populateResults(genre, 'genre')
  } 

  if(country) {
    populateResults(country, 'country')
  }

  if(avg_vote) {
    if(typeof eval(avg_vote) !== 'number') {
      res.status(400).send('Must input a valid number.')
    }
    newResults = newResults.filter(vote => {
      return Number(vote.avg_vote) >= Number(avg_vote)
    })
  }

  if (newResults.length === 0) {
    return res.send('No movies match your criteria')
  }

  res.send(newResults);
});