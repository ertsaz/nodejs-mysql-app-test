const express = require('express');
const exhbs = require('express-handlebars');
const morgan = require('morgan');
const path = require('path');
const app = express();

//setting
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exhbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'parcials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//midlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//routes
app.use(require('./routes/tablas'));

//inicializando el servidor
app.listen(app.get('port'), () => {
    console.log('server en puerto:', app.get('port'));
});

