import request from "supertest";
import { app } from "../express";
import * as ClientCheckoutModel from "../../../modules/checkout/repository/client.model";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import * as ProductAdmModel from "../../../modules/product-adm/repository/product.model";
import ProductModel from "../../../modules/store-catalog/repository/product.model";
import { Umzug } from "umzug";
import { migrator } from "../../migrations/config/migrator";
import OrderItemModel from "../../../modules/checkout/repository/order-item.model";
import OrderModel from "../../../modules/checkout/repository/order.model";
import TransactionModel from "../../../modules/payment/repository/transaction.model";
import InvoiceModel from "../../../modules/invoice/repository/invoice.model";
import InvoiceItemModel from "../../../modules/invoice/repository/invoice-item.model";
describe("Checkout API E2E test", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

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
    //await sequelize.sync({force: true})
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a place order", async () => {
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

    await ProductModel.create({
        id: "2",
        name: "Product 2",
        description: "Product 2 description",
        salesPrice: 200,
        purchasePrice: 100,
        stock: 100,
      });


    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: "1",
        products: [
          {
            productId: "1",
            quantity: 1,
          },
          {
            productId: "2",
            quantity: 2,
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.invoiceId).toBeDefined();
    expect(response.body.status).toBe("pending");
    expect(response.body.total).toBe(300);
    expect(response.body.products.length).toBe(2);
    expect(response.body.products[0].productId).toBe("1");
    expect(response.body.products[1].productId).toBe("2");
    
  });
});
