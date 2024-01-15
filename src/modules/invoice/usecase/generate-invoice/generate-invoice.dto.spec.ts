import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const invoice = {
    id: "inv-1",
    name: "Invoice 1",
    document: "123456789",
    address: {
        street: "Street 1",
        number: "123",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "123456789",
    },
    items: [{
        id: "item-inv-1",
        name: "Item 1",
        price: 100 
    },
    {
        id: "item-inv-2",
        name: "Item 2",
        price: 200
    }],
    total: 100
}

const MockRepository = () => {
    return {
        find: jest.fn(),
        generate: jest.fn().mockReturnValue(Promise.resolve(invoice))
    };
}

describe("Generate Invoice Usecase", () => {
    it("should generate an invoice", async () => {
        const invoiceRepository = MockRepository();
        const usecase = new GenerateInvoiceUseCase(invoiceRepository);

        const input = {
            name: "Invoice 1",
            document: "123456789",
            street: "Street 1",
            number: "123",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "123456789",
            items: [{
                id: "item-inv-1",
                name: "Item 1",
                price: 100 
            },
            {
                id: "item-inv-2",
                name: "Item 2",
                price: 200
            }]
        }

        const result = await usecase.execute(input);

        expect(invoiceRepository.generate).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toBe("Invoice 1");
        expect(result.document).toBe("123456789");
        expect(result.street).toBe("Street 1");
        expect(result.number).toBe("123");
        expect(result.complement).toBe("Complement 1");
        expect(result.city).toBe("City 1");
        expect(result.state).toBe("State 1");
        expect(result.zipCode).toBe("123456789");
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toBe("item-inv-1");
        expect(result.items[0].name).toBe("Item 1");
        expect(result.items[0].price).toBe(100);
        expect(result.items[1].id).toBe("item-inv-2");
        expect(result.items[1].name).toBe("Item 2");
        expect(result.items[1].price).toBe(200);
        expect(result.total).toBe(300);
    });
});