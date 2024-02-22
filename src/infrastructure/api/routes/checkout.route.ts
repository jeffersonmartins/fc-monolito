import express, { Request, Response } from 'express';
import CheckoutFacadeFactory from '../../../modules/checkout/factory/checkout.facade.factory';
export const checkoutRoute = express.Router();

checkoutRoute.post('/', async(req: Request, res: Response) => {
    try
    {
        const facade = CheckoutFacadeFactory.create();
        const products = req.body.products;
        const input = {
            clientId: req.body.clientId,
            products: products,
        }

        const output = await facade.placeOrder(input);

        return res.status(201).send(output);
    } catch(error) {
        res.status(500).send(error);
    }
})