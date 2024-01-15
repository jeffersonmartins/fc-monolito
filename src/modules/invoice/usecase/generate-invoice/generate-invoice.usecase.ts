import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import InvoiceAddress from "../../domain/invoice-address";
import InvoiceItems from "../../domain/invoice-item";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDTO, GenerateInvoiceUseCaseOutputDTO } from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase {
    constructor(private readonly invoiceRepository: InvoiceGateway) {}

    async execute(input: GenerateInvoiceUseCaseInputDTO): Promise<GenerateInvoiceUseCaseOutputDTO> {
        
        const invoiceAddressProps = new InvoiceAddress({ 
            street: input.street,
            number: input.number,
            complement: input.complement,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode
        });

        const items = input.items.map((item) => {
            return new InvoiceItems({
                id: new Id(item.id),
                name: item.name,
                price: item.price
            })
        })

        const props = {
            name: input.name,
            document: input.document,
            address: invoiceAddressProps,
            items: items
        };

        const invoice = new Invoice(props);
        await this.invoiceRepository.generate(invoice);

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map((item) => ({
                id: item.id.id,
                name: item.name,
                price: item.price
            })),
            total: invoice.items.reduce((total, item) => total + item.price, 0),
        }
        
    }

}