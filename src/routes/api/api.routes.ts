import { Router } from "express";
import { push } from "./push/push.routes";
import { customers } from "./customers/customers.routes";

const api = Router();

api.use('/push', push);
api.use('/customers', customers);

export { api };