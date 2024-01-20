import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import ClientModel from "./client.model";
import OrderModel from "./order.model";
import OrderItem from "../domain/order-item.entity";
import OrderItemModel from "./order-item.model";

export default class CheckoutRepository implements CheckoutGateway {
    async findOrder(id: string): Promise<Order> {
        const order = await OrderModel.findOne({
            where: { id },
            include: [OrderItemModel, ClientModel]
        });

        if (!order) {
            throw new Error(`Order ${id} not found`);
        }

        return new Order({
            id: new Id(order.id),
            client: new Client(
                { id: new Id(order.client.id), 
                  name: order.client.name, 
                  email: order.client.email, 
                  address: order.client.address 
                }),
                items: order.items.map((item) => {
                    return new OrderItem({
                      id: new Id(item.id),
                      name: item.name,
                      description: item.description,
                      salesPrice: item.salesPrice,
                    })
                  }),
                status: order.status,
        });
        
    }
    async addOrder(order: Order): Promise<void> {
        
        await OrderModel.create({
            id: order.id.id,
            client: new ClientModel({
                id: order.client.id.id,
                name: order.client.name,
                email: order.client.email,
                address: order.client.address
            }),
            status: order.status,
            total: order.total,
            items: order.items.map((item) => {
                return new OrderItemModel({
                    id: item.id.id,
                    name: item.name,
                    description: item.description,
                    salesPrice: item.salesPrice
                })
            }),
        }, 
        {
            include: [OrderItemModel, ClientModel]
        });
    }
}