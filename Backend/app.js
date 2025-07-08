const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const rootDir = require('./utils/pathUtil');

const cors = require('cors');

const DB_PATH = "mongodb+srv://csit:csit@csit.lq452pz.mongodb.net/CSITDB?retryWrites=true&w=majority&appName=CSIT";

const session = require('express-session');
const MongoDBStore= require('connect-mongodb-session')
(session);

const questionsRouter = require('./routes/questionsRouter');
const authRouter = require('./routes/authRouter');
const testRouter = require('./routes/testRouter');
const dashboardRouter = require('./routes/dashboardRouter');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
 
}));

const store = new MongoDBStore({
  uri: DB_PATH,
  collection: 'sessions'
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, 'public')));

app.use(session({
  secret: "CSIT entrance preparation",
  resave: false,
  saveUninitialized: false,
  store
}));


app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session?.isLoggedIn || false;
  res.locals.user = req.session?.user || null;
  next();
});


app.use(express.json())

app.use('/questions', questionsRouter);
app.use("/api", authRouter);

app.use( '/api/test',testRouter);

app.get('/add-question', (req, res) => {
  res.render('add-question', { message: null });
});

app.use( dashboardRouter);





app.get('/', (req, res) => {
  if (req.session.isLoggedIn && req.session.user) {
    res.render('home-loggedin', {
      currentPage: 'home',
      user: req.session.user,
      isLoggedIn: true
    });
  } else {
    res.render('home-guest', {
      currentPage: 'home',
      isLoggedIn: false
    });
  }
});




app.use((req, res, next) => {
  res.status(404).render('404', {
    currentPage: null,
    isLoggedIn: req.session.isLoggedIn || false,
    user: req.session.user || null,
    url: req.originalUrl
  });
});



const PORT = 3001;


mongoose.connect(DB_PATH).then(() => {
  console.log('Connected to Mongo');
  app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log('MongoDB connection error ❌', err);
});
