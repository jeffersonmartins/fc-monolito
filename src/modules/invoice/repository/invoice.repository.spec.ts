import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceRepository from "./invoice.repository";
import Invoice from "../domain/invoice";
import InvoiceAddress from "../domain/invoice-address";
import InvoiceItem from "../domain/invoice-item";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("Invoice Repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
       sequelize = new Sequelize({
           dialect: 'sqlite',
           storage: ':memory:',
           logging: false,
           sync: { force: true }
       });

       sequelize.addModels([InvoiceModel, InvoiceItemModel]);
       await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });
    
    it("should create an invoice", async () => {

        const item1 = new InvoiceItem({ name: "Item 1", price: 100 });
        const item2 = new InvoiceItem({ name: "Item 2", price: 200 });

        const invoice = new Invoice({
            id: new Id("inv-1"),
            name: "Invoice 1",
            document: "123456789",
            address: new InvoiceAddress({
                street: "Street 1",
                number: "123",
                complement: "Complement 1",
                city: "City 1",
                state: "State 1",
                zipCode: "123456789",
            }),
            items: [item1, item2],
        });

        const repository = new InvoiceRepository();
        await repository.generate(invoice);

        const invoiceDb = await InvoiceModel.findOne({ where: { id: "inv-1" }, include: [{ model: InvoiceItemModel, as: 'items' }] });

        expect(invoiceDb).toBeDefined();
        
        expect(invoiceDb.id).toEqual(invoice.id.id);
        expect(invoiceDb.name).toEqual(invoice.name);
        expect(invoiceDb.document).toEqual(invoice.document);
        expect(invoiceDb.street).toEqual(invoice.address.street);
        expect(invoiceDb.number).toEqual(invoice.address.number);
        expect(invoiceDb.complement).toEqual(invoice.address.complement);
        expect(invoiceDb.city).toEqual(invoice.address.city);
        expect(invoiceDb.state).toEqual(invoice.address.state);
        expect(invoiceDb.zipCode).toEqual(invoice.address.zipCode);
        
        expect(invoiceDb.items.length).toBe(2);
    });

    it("should find an invoice", async () => {

        const item1 = new InvoiceItem({ name: "Item 1", price: 100 });
        const item2 = new InvoiceItem({ name: "Item 2", price: 200 });

        const invoice = new Invoice({
            id: new Id("inv-1"),
            name: "Invoice 1",
            document: "123456789",
            address: new InvoiceAddress({
                street: "Street 1",
                number: "123",
                complement: "Complement 1",
                city: "City 1",
                state: "State 1",
                zipCode: "123456789",
            }),
            items: [item1, item2],
        });
        
        const repository = new InvoiceRepository();
        await repository.generate(invoice);

        const invoiceDb = await repository.find("inv-1");

        expect(invoiceDb).toBeDefined();

        expect(invoiceDb.id.id).toBeDefined();
        expect(invoiceDb.name).toEqual(invoice.name);
        expect(invoiceDb.document).toEqual(invoice.document);
        expect(invoiceDb.address.street).toEqual(invoice.address.street);
        expect(invoiceDb.address.number).toEqual(invoice.address.number);
        expect(invoiceDb.address.complement).toEqual(invoice.address.complement);
        expect(invoiceDb.address.city).toEqual(invoice.address.city);
        expect(invoiceDb.address.state).toEqual(invoice.address.state);
        expect(invoiceDb.address.zipCode).toEqual(invoice.address.zipCode);

        expect(invoiceDb.items.length).toBe(2);

        expect(invoiceDb.items[0].name).toEqual(item1.name);
        expect(invoiceDb.items[0].price).toEqual(item1.price);

        expect(invoiceDb.items[1].name).toEqual(item2.name);
        expect(invoiceDb.items[1].price).toEqual(item2.price);


    });

    it("Should throw an error when invoice not found", async () => {

        const repository = new InvoiceRepository();
        await expect(repository.find("inv-1")).rejects.toThrowError("Invoice not found");
        
    })
});