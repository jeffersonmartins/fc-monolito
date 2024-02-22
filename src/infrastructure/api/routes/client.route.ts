import express, { Request, Response } from 'express';
import AddClientUseCase from '../../../modules/client-adm/usecase/add-client/add-client.usecase';
import ClientAdmFacadeFactory from '../../../modules/client-adm/factory/client-adm.facade.factory';
export const clientRoute = express.Router();

clientRoute.post('/', async(req: Request, res: Response) => {
    try {

        
        const facade = ClientAdmFacadeFactory.create();
        const output = await
        facade.add({
            name: req.body.name,
            email: req.body.email,
            document: req.body.document,
            address: {
                street: req.body.address.street,
                number: req.body.address.number,
                complement: req.body.address.complement,
                city: req.body.address.city,
                state: req.body.address.state,
                zipCode: req.body.address.zipCode
            }
        });

        return res.status(201).send(output);
    } catch(err) {
        return res.status(500).send({ error: err });
    }
});
