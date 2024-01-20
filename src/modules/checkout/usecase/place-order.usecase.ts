import Id from "../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../client-adm/facade/client-adm.facade.interface";
import ProductAdmFacadeInterface from "../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../store-catalog/facade/store-catalog.facade.interface";
import Order from "../domain/order.entity";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";
import CheckoutGateway from '../gateway/checkout.gateway';
import { InvoiceFacadeInterface } from "../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../payment/facade/facade.interface";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";
import OrderItem from "../domain/order-item.entity";

export default class PlaceOrderUseCase implements UseCaseInterface {
    
    private _clientFacade: ClientAdmFacadeInterface;
    private _productFacade: ProductAdmFacadeInterface;
    private _catalogFacade: StoreCatalogFacadeInterface;
    private _repository: CheckoutGateway;
    private _invoiceFacade:InvoiceFacadeInterface;
    private _paymentFacade: PaymentFacadeInterface;

    constructor(clientFacade: ClientAdmFacadeInterface,
         productFacade: ProductAdmFacadeInterface, 
         catalogFacade: StoreCatalogFacadeInterface,
         repository: CheckoutGateway,
         invoiceFacade: InvoiceFacadeInterface,
         paymentFacade: PaymentFacadeInterface) {

        this._clientFacade = clientFacade;
        this._productFacade = productFacade;
        this._catalogFacade = catalogFacade;
        this._repository = repository;
        this._invoiceFacade = invoiceFacade;
        this._paymentFacade = paymentFacade;

    }

    async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
        
        const client = await this._clientFacade.find({ id: input.clientId });
        if (!client) {
            throw new Error("Client not found");
        }
        await this.validateProducts(input);

        const products = await Promise.all(
            input.products.map(
                (p) => this.getProduct(p.productId)
            )
        )

        const myClient = new Client({
            id: new Id(client.id),
            name: client.name,
            email: client.email,
            address: client.address.street
        });

        const order = new Order({
            client: myClient,
            items: products.map((p) => {
                return new OrderItem({
                    id: new Id(p.id.id),
                    name: p.name,
                    description: p.description,
                    salesPrice: p.salesPrice
                })
            })
        });

        await this._repository.addOrder(order);

        const payment = await this._paymentFacade.process({
            orderId: order.id.id,
            amount: order.total
        });

        const invoice = 
            payment.status === "approved" ?
            await this._invoiceFacade.generate({
                name: client.name,
                document: client.document,
                street: client.address.street,
                number: client.address.number,
                complement: client.address.complement,
                city: client.address.city,
                state: client.address.state,
                zipCode: client.address.zipCode,
                items: products.map((p) => {
                    return {
                        id: p.id.id,
                        name: p.name,
                        price: p.salesPrice,
                    }
                }),
                total: order.total
            }) : null;

       
        return {
            id: order.id.id,
            invoiceId: payment.status === "approved" ? invoice.id : null,
            status: order.status,
            total: order.total,
            products: order.items.map((p) => {
                return {
                    productId: p.id.id
                }
            })

        }
    }
    
    private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
        if (input.products.length === 0) {
            throw new Error("No products selected");
        }

        for(const p of input.products) {
            const product = await this._productFacade.checkStock({
                productId: p.productId,
            });

            if (product.stock <= 0) {
                throw new Error(`Product ${p.productId} is not available in stock`);
            }
        }
    }

    private async getProduct(productId: string): Promise<Product> {
        const product = await this._catalogFacade.find({ id: productId });

        if (!product) {
            throw new Error("Product not found");
        }

        const productProps = {
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice
        }

        return new Product(productProps);
    }
}