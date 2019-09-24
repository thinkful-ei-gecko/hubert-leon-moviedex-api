const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

let movies = require('movies-data-small.json');

