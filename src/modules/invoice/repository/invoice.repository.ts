import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceAddress from "../domain/invoice-address";
import InvoiceItem from "../domain/invoice-item";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {

    async generate(invoice: Invoice): Promise<void> {
        await InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
            items: invoice.items.map((item) => ({
                id: item.id.id,
                name: item.name,
                price: item.price
            }))
        },
        {
            include: [{ model: InvoiceItemModel, as: 'items' }]
        });
    }

    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({
            where: { id },
            include: [{ model: InvoiceItemModel, as: 'items' }]
        });

        if (!invoice) {
            throw new Error("Invoice not found");
        }

        return new Invoice({
            name: invoice.name,
            document: invoice.document,
            address: new InvoiceAddress({
                street: invoice.street,
                number: invoice.number,
                complement: invoice.complement,
                city: invoice.city,
                state: invoice.state,
                zipCode: invoice.zipCode
            }),
            CreatedAt: invoice.createdAt,
            UpdatedAt: invoice.updatedAt,
            items: invoice.items.map((item) => new InvoiceItem({
                id: new Id(item.id),
                name: item.name,
                price: item.price
            }))
        })
    }
}