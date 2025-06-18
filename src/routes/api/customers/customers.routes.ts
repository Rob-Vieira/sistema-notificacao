import { Router } from "express";
import { PushController } from '../../../controller/api/push/push.controller';
import { CustomersController } from "../../../controller/api/customers/customers.controller";

const customers = Router();

customers.get('/', CustomersController.all);
customers.get('/:search', CustomersController.all);

export { customers };