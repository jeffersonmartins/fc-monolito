import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import { Sequelize } from "sequelize-typescript";
import OrderModel from "./order.model";
import CheckoutRepository from "./checkout.repository";
import ClientModel from "./client.model";
import OrderItemModel from "./order-item.model";
import OrderItem from "../domain/order-item.entity";

describe("Order Repository test", () => {

    let sequelize: Sequelize;
    
    const client = new Client({
       id: new Id("1"),
       name: "Client",
       email: "email",
       address: "address 1"
    });

    const product1 = new OrderItem({
        id: new Id("1"),
        name: "Product 1",
        description: "Description 1",
        salesPrice: 100
    });

    const product2 = new OrderItem({
        id: new Id("2"),
        name: "Product 2",
        description: "Description 2",
        salesPrice: 200
    });

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([OrderModel, ClientModel, OrderItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    })


    it("should create a order", async () => {
        const orderRepository = new CheckoutRepository();

        const order = new Order({
            id: new Id("1"),
            client: client,
            items: [product1, product2],
        });

        await orderRepository.addOrder(order);

        const orderDb = await OrderModel.findOne({
            where: { id: order.id.id },
            include: [{model: OrderItemModel, as: 'items'}, { model: ClientModel, as: 'client' }],
            rejectOnEmpty: true
        });
        
        expect(orderDb.id).toBe(order.id.id);
        expect(orderDb.client.toJSON()).toStrictEqual(
            {
                id: client.id.id,
                name: client.name,
                email: client.email,
                address: client.address
            }
        );

        expect(orderDb.status).toBe(order.status);
        expect(orderDb.items.length).toBe(2);
        expect(orderDb.total).toBe(order.total);
        expect(orderDb.items[0].name).toEqual(product1.name);
        expect(orderDb.items[0].description).toEqual(product1.description);
        expect(orderDb.items[0].salesPrice).toEqual(product1.salesPrice);
        expect(orderDb.items[1].name).toEqual(product2.name);
        expect(orderDb.items[1].description).toEqual(product2.description);
        expect(orderDb.items[1].salesPrice).toEqual(product2.salesPrice);

    });


    it("should find a order", async () => {

        const orderRepository = new CheckoutRepository();

        const order = new Order({
            id: new Id("2"),
            client: client,
            items: [product1, product2],
        });
        
        await orderRepository.addOrder(order);

        const orderDb = await orderRepository.findOrder(order.id.id);

        expect(orderDb.id.id).toBe(order.id.id);
        expect(orderDb.client.id.id).toBe(client.id.id);
        expect(orderDb.client.name).toBe(client.name);
        expect(orderDb.client.email).toBe(client.email);
        expect(orderDb.client.address).toBe(client.address);
        expect(orderDb.status).toBe(order.status);
        expect(orderDb.total).toBe(order.total);
        expect(orderDb.items.length).toBe(2);
        expect(orderDb.items[0].name).toEqual(product1.name);
        expect(orderDb.items[0].description).toEqual(product1.description);
        expect(orderDb.items[0].salesPrice).toEqual(product1.salesPrice);
        expect(orderDb.items[1].name).toEqual(product2.name);
        expect(orderDb.items[1].description).toEqual(product2.description);
        expect(orderDb.items[1].salesPrice).toEqual(product2.salesPrice);

    })
})