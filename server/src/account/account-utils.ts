import { Expense } from "../types";
import { Request, Response } from "express";

export function createAccountServer(req: Request, res: Response, expenses: Expense[]) {
    // const { id, cost, description } = req.body;

    // if (!description || !id || !cost) {
    //     return res.status(400).send({ error: "Missing required fields" });
    // }

    // const newExpense: Expense = {
    //     id: id,
    //     description,
    //     cost,
    // };

    // expenses.push(newExpense);
    // res.status(201).send(newExpense);
}
