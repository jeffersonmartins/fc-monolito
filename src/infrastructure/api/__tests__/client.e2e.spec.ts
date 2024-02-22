import { Sequelize } from "sequelize-typescript";
import { app } from "../express"
import request from "supertest";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";

describe("Client API E2E test", () => {
    let sequelize: Sequelize;

    beforeEach(async() => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true}
        });
        
        sequelize.addModels([ClientModel]);
        await sequelize.sync({force: true})
    });

    afterEach(async() => {
        await sequelize.close();
    });

    it("should create a client", async() => {

        const client = {
            name: "Jefferson",
            email: "jefferson@testexyz.com",
            document: "1234-5678",
            address: {
                street: "Rua XYZ",
                number: "88",
                complement: "Casa",
                city: "São José dos Pinhais",
                state: "PR",
                zipCode: "88888-888",
            }
        }

        const response = 
            await request(app)  
                .post("/client")
                .send(client);

        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe(client.name);
        expect(response.body.email).toBe(client.email);
        expect(response.body.document).toBe(client.document);
        expect(response.body.address.street).toBe(client.address.street);
        expect(response.body.address.number).toBe(client.address.number);
        expect(response.body.address.complement).toBe(client.address.complement);
        expect(response.body.address.city).toBe(client.address.city);
        expect(response.body.address.state).toBe(client.address.state);
        expect(response.body.address.zipCode).toBe(client.address.zipCode);
    })
})