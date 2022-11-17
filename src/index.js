const express = require('express');

const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
// Initializations
const app = express();
require('./database');
require('./config/passport');

//Settings
app.set('port', process.env.PORT || 3000);
//Es un modulo el path que permite conectar directorios, el __dirname retorna la ubicación de src y lo concatena con views
app.set('views', path.join(__dirname, 'views'));
//En esta parte se agregó el allow para permitir al aplicativo a acceder a los nombres como user.name
app.engine('.hbs', exphbs({
    defaultLayout:'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
        },
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname:'.hbs'
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}));

const storage = multer.diskStorage({
    destination: path.join(__dirname,'public/uploads'),
    filename: (req, file, cb) =>  {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

app.post('/creoUpload', function(req, res, next) {
    upload(req, res, function (err) {
      if (err) {
        // An error occurred when uploading
        console.log('Err: ', err);
        return;
      } else {
         console.log('req.file: ', JSON.stringify(req.file));  
         console.log('req.files: ', JSON.stringify(req.files));
         return;
      }
    })
  });




//Revida los inputs ocultos de la página
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use(multer({storage: storage}).single('image'));
//Routes
app.use(require('./routes/index'))
app.use(require('./routes/notes'))
app.use(require('./routes/users'))

//Static Files
app.use(express.static(path.join(__dirname, 'public')));
// Server is listenning
app.listen(app.get('port'),() => {
    console.log('Server on port ', app.get('port'));
})