import PlaceOrderUseCase from "../usecase/place-order.usecase";
import CheckoutFacade from "./checkout.facade";

describe("Checkout Facade test", () => {

    it("should place an order", async() => {
        const mock = (): PlaceOrderUseCase => {
            //@ts-ignore
            return {
                execute: jest.fn().mockImplementation(() => {
                    return {
                        id: "123",
                        invoiceId: "123",
                        status: "approved",
                        total: 100,
                        products: [
                            {
                                productId: "123"
                            }
                        ]
                    }
                })
            }
        }

        const mockFacade = mock();
        const facade = new CheckoutFacade(mockFacade);
        await facade.placeOrder({ clientId: "123", products: [{ productId: "123", quantity: 1 }] });

        expect(mockFacade.execute).toHaveBeenCalledTimes(1);
    });
})