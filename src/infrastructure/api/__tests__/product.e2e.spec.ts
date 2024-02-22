import { Sequelize } from "sequelize-typescript"
import { ProductModel } from "../../../modules/product-adm/repository/product.model";
import request from 'supertest';
import { app } from "../express";

describe("Product API E2E test", () => {
    
    let sequelize: Sequelize;

    beforeEach(async() => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true}
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync({force: true})
    });

    afterEach(async() => {
        await sequelize.close();
    });
    

    it("should create a product", async() => {

        const product = {
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: 10
        }

        const response =
            await request(app)
                .post("/product")
                .send(product);

        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe(product.name);
        expect(response.body.description).toBe(product.description);
        expect(response.body.purchasePrice).toBe(product.purchasePrice);
        expect(response.body.stock).toBe(product.stock);
        
    })
})