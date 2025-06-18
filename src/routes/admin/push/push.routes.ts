import { Router } from "express";
import { PushController } from "../../../controller/admin/push/push.controller";

const push = Router();

push.get('/', PushController.index);
push.get('/detail/:id', PushController.detail);
push.get('/send/', PushController.send);
push.get('/send/:id', PushController.send);

push.post('/notify', PushController.notify);

export { push };