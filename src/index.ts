import 'dotenv/config';
import express from 'express';

import { setupRoutes } from './routes';
import { setupBD } from './database';
import { setupFirebase } from './config/firebase/firebase.config';
import { setupHandlebars } from './config/handlebars/handlebars.config';

const port = process.env.PORT || 3000
const app = express();

setupFirebase()
setupBD();
setupHandlebars(app);
setupRoutes(app);

app.listen(port, () => {
    if(process.env.PROD === 'true'){
        console.log('Server on');
    }
    else{
        console.log('Server is running on http://localhost:' + port);
    }
});