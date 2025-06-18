import express from 'express';
import cors from 'cors';
import db from '../database';

import { admin } from './admin/admin.routes';
import { api } from './api/api.routes';
import { defaultData } from '../middlewares/default-data';

export function setupRoutes(app: express.Express){
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(defaultData);

    app.use('/api', api);
    app.use('/admin', admin);

    app.get('/', (req, res) => {
        const devices = db.prepare('SELECT * FROM devices').all();
        const customers = db.prepare('SELECT * FROM customers').all();

        res.json({devices, customers});
    });
}