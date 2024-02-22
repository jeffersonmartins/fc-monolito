import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import CheckoutFacade from "../facade/checkout.facade";
import CheckoutFacadeInterface from "../facade/checkout.facade.interface";
import CheckoutRepository from "../repository/checkout.repository";
import PlaceOrderUseCase from "../usecase/place-order.usecase";

export default class CheckoutFacadeFactory {
    static create(): CheckoutFacadeInterface {
        
        const clientAdm = ClientAdmFacadeFactory.create();
        const productAdm = ProductAdmFacadeFactory.create();
        const storeCatalog = StoreCatalogFacadeFactory.create();
        const invoiceFacade = InvoiceFacadeFactory.create();
        const paymentFacade =  PaymentFacadeFactory.create();
        const checkoutRepository = new CheckoutRepository();

        const placeOrder = new PlaceOrderUseCase(clientAdm, productAdm, storeCatalog, checkoutRepository ,invoiceFacade, paymentFacade);
        return new CheckoutFacade(placeOrder);
    }
}