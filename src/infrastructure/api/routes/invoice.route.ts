import express, { Request, Response } from "express";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";
export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request, res: Response) => {
    try {
        const facade = InvoiceFacadeFactory.create();

        const invoice = await facade.find({
          id: req.params.id,
        });
      
        return res.status(200).send(invoice);
    } catch(error) {
        console.log(error);
        return res.status(500).send(error);
    }

});
