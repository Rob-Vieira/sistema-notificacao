import { Router } from "express";
import { push } from "./push/push.routes";

const admin = Router();

admin.use('/push', push);

export { admin };