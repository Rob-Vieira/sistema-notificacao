import { Router } from "express";
import { PushController } from '../../../controller/api/push/push.controller';

const push = Router();

push.post('/register', PushController.register);
push.post('/notify', PushController.notify);
push.post('/notify-one', PushController.notifyOne);
push.post('/notify-all', PushController.notifyAll);
push.post('/notify-batch', PushController.notifyBatch);

export { push };