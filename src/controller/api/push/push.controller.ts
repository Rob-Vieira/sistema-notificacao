import { Request, Response } from 'express';
import db from '../../../database';
import firebase from 'firebase-admin';

export class PushController {
    public static register(req: Request, res: Response): void {
        if (!req.body) {
            res.status(400).json({ message: 'Dados obrigatórios não enviados.' });
        }

        const { name, cpf, token } = req.body

        const customer: any = db.prepare('SELECT * FROM customers WHERE cpf = ?').get(cpf);

        let customers_id: any = 0;

        console.log(customer);

        if (!customer) {
            customers_id = db.prepare('INSERT INTO customers (name, cpf) VALUES (?, ?)').run(name, cpf).lastInsertRowid;
        }
        else {
            customers_id = customer.id;
        }

        const device = db.prepare('SELECT * FROM devices WHERE token = ?').get(token);

        console.log(device);

        if (!device) {
            const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
            db.prepare('INSERT INTO devices (token, id_customer, last_success) VALUES (?, ?, ?)').run(token, customers_id, now);

            res.status(200).json({ message: 'Token registrado com sucesso' });
        }
        else {
            res.status(502).json({ message: 'Token já cadastrado no sistema' });
        }
    }

    public static async notify(req: Request, res: Response): Promise<void> {
        const { token, title, body } = req.body;

        const device: any = db.prepare('SELECT * FROM devices where token = ?').get(token);

        if (device) {
            try {
                const message = {
                    token: device.token,
                    notification: {
                        title,
                        body
                    }
                };

                const firebaseResponse = await firebase.messaging().send(message);
                const now = new Date().toISOString().replace('T', ' ').substring(0, 19);


                db.prepare('UPDATE devices SET last_success = ? WHERE id = ?').run(now, device.id);

                console.log('Notificação enviada:', firebaseResponse);

                res.status(200).json({ status: true });
            }
            catch (error: any) {
                PushController.proccessErrors(error, device.id);

                res.status(200).json({ status: false });
            }
        }

        res.status(200).json({ status: false });
    }

    public static async notifyOne(req: Request, res: Response): Promise<void> {
        const { cpf, title, body } = req.body;

        const response = {
            errors: 0,
            success: 0
        };

        const devices = db.prepare(`
            SELECT devices.token, devices.id
            FROM devices
            JOIN customers ON customers.id = devices.id_customer
            WHERE customers.cpf = ?
        `).all(cpf);

        console.log(devices);

        devices.forEach(async (device: any) => {
            try {
                const message = {
                    token: device.token,
                    notification: {
                        title,
                        body
                    }
                };

                const firebaseResponse = await firebase.messaging().send(message);
                const now = new Date().toISOString().replace('T', ' ').substring(0, 19);


                db.prepare('UPDATE devices SET last_success = ? WHERE id = ?').run(now, device.id);

                console.log('Notificação enviada:', firebaseResponse);
                response.success++;
            }
            catch (error: any) {
                PushController.proccessErrors(error, device.id);

                response.errors++
            }
        });


        res.status(200).json(response);
    }

    public static async notifyAll(req: Request, res: Response): Promise<void> {
        const { cpf, title, body } = req.body;

        const response = {
            errors: 0,
            success: 0
        };

        const devices = db.prepare(`
            SELECT token, devices
            FROM devices
        `).all();

        console.log(devices);

        devices.forEach(async (device: any) => {
            try {
                const message = {
                    token: device.token,
                    notification: {
                        title,
                        body
                    }
                };

                const firebaseResponse = await firebase.messaging().send(message);
                const now = new Date().toISOString().replace('T', ' ').substring(0, 19);


                db.prepare('UPDATE devices SET last_success = ? WHERE id = ?').run(now, device.id);

                console.log('Notificação enviada:', firebaseResponse);
                response.success++;
            }
            catch (error: any) {
                PushController.proccessErrors(error, device.id);

                response.errors++
            }
        });


        res.status(200).json(response);
    }

    public static async notifyBatch(req: Request, res: Response): Promise<void> {
        const { cpfs, title, body } = req.body;

        const response = {
            errors: 0,
            success: 0
        };

        cpfs.forEach((cpf: any, index: any) => {
            const devices = db.prepare(`
                SELECT devices.token, devices.id
                FROM devices
                JOIN customers ON customers.id = devices.id_customer
                WHERE customers.cpf = ?
            `).all(cpf);

            console.log(devices);

            devices.forEach(async (device: any) => {
                try {
                    const message = {
                        token: device.token,
                        notification: {
                            title: title + ' ' + index,
                            body: body + ' ' + index
                        }
                    };

                    const firebaseResponse = await firebase.messaging().send(message);
                    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);


                    db.prepare('UPDATE devices SET last_success = ? WHERE id = ?').run(now, device.id);

                    console.log('Notificação enviada:', firebaseResponse);
                    response.success++;
                }
                catch (error: any) {
                    PushController.proccessErrors(error, device.id);

                    response.errors++
                }
            });
        });



        res.status(200).json(response);
    }

    private static proccessErrors(error: any, id: any = null) {
        // messaging/invalid-registration-token -> O token FCM fornecido é inválido.
        // messaging/registration-token-not-registered -> O token foi desativado ou o app foi desinstalado.
        // messaging/invalid-recipient -> O destinatário (token ou tópico) não é válido.

        // messaging/invalid-payload -> O corpo da mensagem está malformado ou contém dados inválidos.
        // messaging/payload-size-limit-exceeded -> A mensagem ultrapassou o limite de tamanho permitido (4 KB para dados).
        // messaging/invalid-data-payload-key -> Uma das chaves do campo `data` contém caracteres inválidos ou reservados.
        // messaging/invalid-ttl -> O valor TTL (tempo de vida da mensagem) está fora do intervalo permitido.
        // messaging/invalid-message -> A estrutura da mensagem está incorreta ou incompleta.

        // messaging/invalid-argument -> Algum argumento passado à função de envio está inválido.
        // messaging/authentication-error -> Falha na autenticação com as credenciais do Firebase Admin SDK.
        // messaging/unauthenticated -> A requisição não foi autenticada corretamente.
        // messaging/insufficient-permission -> O projeto do Firebase não tem permissão para enviar notificações.
        // messaging/mismatched-credential -> As credenciais usadas não correspondem ao projeto do Firebase.

        // messaging/internal-error -> Erro interno do Firebase. Pode ser temporário.
        // messaging/server-unavailable -> O servidor do Firebase está temporariamente indisponível. Tente novamente.
        // messaging/unknown-error -> Um erro desconhecido ocorreu. Tente novamente ou verifique os dados.
        // messaging/network-error -> Erro de rede ao tentar se comunicar com os servidores do FCM.

        console.error('Erro ao enviar notificação:', error);

        if (error.code == 'messaging/invalid-registration-token' || error.code == 'invalid-recipient' || error.code == 'messaging/invalid-argument') {
            if (id) {
                db.prepare('DELETE FROM devices WHERE id = ?').run(id);
            }
        }

        if (error.code == 'messaging/registration-token-not-registered') {
            //Implementar a lógica se o último sucesso foi a um determinado tempo.
        }
    }
}