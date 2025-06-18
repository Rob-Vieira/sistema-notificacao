import { Request, Response } from "express";
import db from "../../../database";

export class CustomersController{
    public static all(req: Request, res: Response){
        const custumers = db.prepare(`SELECT * FROM customers`).all();

        res.status(200).json([...custumers]);
    }
}