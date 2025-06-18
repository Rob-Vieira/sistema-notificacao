import { NextFunction, Request, Response } from "express";

export function defaultData(req: Request, res: Response, next: NextFunction){
    res.locals.url = process.env.URL;
    res.locals.urlAdmin = `${process.env.URL}${process.env.URL_ADMIN}`
    res.locals.urlApi = `${process.env.URL}${process.env.URL_API}`

    next();
}