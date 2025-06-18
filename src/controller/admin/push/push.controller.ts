import { Request, Response } from 'express';
import db from '../../../database';
import { getURL } from '../../../utils/url';

export class PushController {
    static view: string = 'pages/push';

    public static index(req: Request, res: Response) {
        const customers = db.prepare(`
            SELECT c.id, c.name, c.cpf, count(d.id) as devices 
            FROM customers c 
            LEFT JOIN devices d 
            ON c.id = d.id_customer 
            GROUP BY c.id, c.name
        `).all();

        console.log(customers);

        res.render(`${PushController.view}/index`, { customers });
    }

    public static detail(req: Request, res: Response) {
        const { id } = req.params;

        if (id) {
            const customer = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(id);
            const devices = db.prepare(`SELECT * FROM devices WHERE id_customer = ?`).all(id);

            console.log(customer);
            console.log(devices);

            res.render(`${PushController.view}/detail`, { customer, devices });
        }
        else {
            res.status(400);
        }
    }

    public static send(req: Request, res: Response) {
        const { id } = req.params;

        const customerPreSelected = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);

        res.render(`${PushController.view}/send`, { customerPreSelected })
    }

    public static async notify(req: Request, res: Response) {
        const { title, message, cpfs } = req.body;

        try{
            const response = await fetch(getURL('api', 'push/notify-batch'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    body: message,
                    cpfs
                })
            });

            console.log("response do envio da api: ", response);
        }
        catch(err){
            console.error('erro no envio da api: ', err);
        }
    }
}