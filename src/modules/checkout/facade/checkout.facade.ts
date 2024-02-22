import PlaceOrderUseCase from '../usecase/place-order.usecase';
import { PlaceOrderFacadeInputDto, PlaceOrderFacadeOutputDto } from './checkout.facade.dto';
import CheckoutFacadeInterface from './checkout.facade.interface';
export default class CheckoutFacade implements CheckoutFacadeInterface {
    constructor(private placeOrderUseCase: PlaceOrderUseCase) {}

    async placeOrder(input: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto> {
        const placeOrderOutput = await this.placeOrderUseCase.execute(input);
        return placeOrderOutput;
    }
}