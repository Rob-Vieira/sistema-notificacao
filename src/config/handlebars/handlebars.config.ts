import express from 'express'
import path from 'path';
import { engine } from 'express-handlebars';

export function setupHandlebars(app: express.Express){
    app.engine('hbs', engine({ 
        extname: '.hbs',
        defaultLayout: 'main' 
    }));
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, '../../views'));
    app.use(express.static(path.join(__dirname, '../../public')));
}