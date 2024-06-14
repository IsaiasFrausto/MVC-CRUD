const express = require('express');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const connectToDatabase = require('./db');

const app = express();

app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('mi secreto'));
app.use(session({
  secret: 'mi secreto',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

// Passport config
passport.use('signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true,
}, async (req, username, password, done) => {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      return done(null, false, { message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await connection.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    const [userRows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    console.log('User after insertion:', userRows);
    const user = userRows[0];
    return done(null, user);
  } catch (err) {
    console.error('Error in signup strategy:', err);
    return done(err);
  }
}));

passport.use('login', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, async (username, password, done) => {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    console.log('Login query result:', rows);
    if (rows.length === 0) {
      return done(null, false, { message: 'User not found' });
    }
    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return done(null, false, { message: 'Invalid password' });
    }
    return done(null, user);
  } catch (err) {
    console.error('Error in login strategy:', err);
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
    console.log('Deserialize query result:', rows);
    if (!rows || rows.length === 0) {
      return done(new Error('User not found'));
    }
    const user = rows[0];
    done(null, user);
  } catch (err) {
    console.error('Error in deserializeUser:', err);
    done(err);
  }
});

// Routes should be loaded after passport strategies are defined
const routes = require('./routes'); // Import the consolidated routes
app.use('/', routes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
