import express, { Request, Response } from 'express';
import ProductAdmFacade from '../../../modules/product-adm/facade/product-adm.facade';
import ProductAdmFacadeFactory from '../../../modules/product-adm/factory/facade.factory';

export const productRoute = express.Router();

productRoute.post('/', async(req: Request, res: Response) => {
    try{
            
        const facade = ProductAdmFacadeFactory.create();
        const output = await
            facade.addProduct({
                name: req.body.name,
                description: req.body.description,
                purchasePrice: req.body.purchasePrice,
                stock: req.body.stock
            });

        res.status(201).send(output);
    } catch(err) {
        res.status(500).send({ error: err });
    }
})