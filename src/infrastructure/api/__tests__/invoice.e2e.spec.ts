import { Umzug } from "umzug";
import InvoiceModel from "../../../modules/invoice/repository/invoice.model";
import InvoiceItemModel from "../../../modules/invoice/repository/invoice-item.model";
import { migrator } from "../../migrations/config/migrator";
import { Sequelize } from "sequelize-typescript";
import request from 'supertest';
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import OrderItemModel from "../../../modules/checkout/repository/order-item.model";
import OrderModel from "../../../modules/checkout/repository/order.model";
import TransactionModel from "../../../modules/payment/repository/transaction.model";
import * as ClientCheckoutModel from "../../../modules/checkout/repository/client.model";
import * as ProductAdmModel from "../../../modules/product-adm/repository/product.model";
import { app } from "../express";
import ProductModel from "../../../modules/store-catalog/repository/product.model";

describe("Invoice API E2E test", () => {
    let sequelize: Sequelize;
    let migration: Umzug<any>;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },

        })

        sequelize.addModels([
            ClientCheckoutModel.default,
            ClientModel,
            ProductAdmModel.ProductModel,
            ProductModel,
            OrderItemModel,
            OrderModel,
            TransactionModel,
            InvoiceModel,
            InvoiceItemModel,
        ]);
        
        migration = migrator(sequelize);
        await migration.up();
    });

    afterEach(async () => {
        await sequelize.close();

    });
    
    it("Should return an invoice", async()=> {

        await ClientModel.create({
            id: "1",
            name: "Client 1",
            email: "client1@testexyz",
            document: "1234",
            street: "Street",
            number: "123",
            complement: "Complement",
            city: "City",
            state: "State",
            zipcode: "12345",
            createdAt: new Date(),
            updatedAt: new Date(),
            });      

        await ProductModel.create({
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            salesPrice: 100,
            purchasePrice: 100,
            stock: 10,
          });
         
    
          const invoice = await request(app)
            .post("/checkout")
            .send({
              clientId: "1",
              products: [
                {
                  productId: "1",
                  quantity: 1,
                }
              ],
        });
  

        const response = await request(app)
        .get(`/invoice/${invoice.body.invoiceId}`)
        .send();


        expect(response.status).toBe(200);
        expect(response.body.id).toBe(invoice.body.invoiceId);
        expect(response.body.name).toBe("Client 1");
        expect(response.body.document).toBe("1234");
        expect(response.body.address.street).toBe("Street");
        expect(response.body.address.number).toBe("123");
        expect(response.body.address.complement).toBe("Complement");
        expect(response.body.address.city).toBe("City");
        expect(response.body.address.state).toBe("State");
        expect(response.body.address.zipCode).toBe("12345");
        expect(response.body.items.length).toBe(1);
        expect(response.body.items[0].id).toBe("1");
        expect(response.body.items[0].name).toBe("Product 1");
        expect(response.body.items[0].price).toBe(100);
        expect(response.body.total).toBe(100);
            
    })
})