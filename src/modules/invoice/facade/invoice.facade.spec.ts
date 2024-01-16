import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";


describe("Invoice Facade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([InvoiceModel, InvoiceItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should generate a invoice", async () => {
        // const repository = new InvoiceRepository();
        // const generateInvoiceUseCase = new GenerateInvoiceUseCase(repository);
        // const facade = new InvoiceFacade({
        //     generateInvoiceUseCase: generateInvoiceUseCase,
        //     findInvoiceUseCase: undefined,
        // });
        
        const facedeFactory = InvoiceFacadeFactory.create();

        const input = {
            name: "invoice 1",
            document: "123",
            street: "street",
            number: "123",
            complement: "complement",
            city: "city",
            state: "state",
            zipCode: "zipCode",
            items: [
                {
                    id: "1",
                    name: "item 1",
                    price: 10
                },
                {
                    id: "2",
                    name: "item 2",
                    price: 20
                }
            ],
            total: 30
        };

        const output = await facedeFactory.generate(input);
        // const output = await facadeFactory.generate(input);

        expect(output).toBeDefined();
        expect(output.id).toBeDefined();
        expect(output.name).toBe(input.name);
        expect(output.document).toBe(input.document);
        expect(output.street).toBe(input.street);
        expect(output.number).toBe(input.number);
        expect(output.complement).toBe(input.complement);
        expect(output.city).toBe(input.city);
        expect(output.state).toBe(input.state);
        expect(output.zipCode).toBe(input.zipCode);
        expect(output.items.length).toBe(2);
        expect(output.items[0].id).toBe(input.items[0].id);
        expect(output.items[0].name).toBe(input.items[0].name);
        expect(output.items[0].price).toBe(input.items[0].price);
        expect(output.items[1].id).toBe(input.items[1].id);
        expect(output.items[1].name).toBe(input.items[1].name);
        expect(output.items[1].price).toBe(input.items[1].price);
        expect(output.total).toBe(30);
    })
})