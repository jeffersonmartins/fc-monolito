import Id from "../../../@shared/domain/value-object/id.value-object";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = {
    id: new Id("inv-1"),
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
        id: new Id("item-inv-1"),
        name: "Item 1",
        price: 100 
    }],
    total: 100,
    createdAt: new Date()
}

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
        generate: jest.fn()
    };
};

describe("Find Invoice Usecase", () => {

    it("should find an invoice", async () => {
        const invoiceRepository = MockRepository();
        const usecase = new FindInvoiceUseCase(invoiceRepository);

        const input = {
            id: "inv-1"
        }

        const result = await usecase.execute(input);

        expect(invoiceRepository.find).toHaveBeenCalled();
        expect(result.id).toBe("inv-1");
        expect(result.name).toBe("Invoice 1");
        expect(result.document).toBe("123456789");
        expect(result.address.street).toBe("Street 1");
        expect(result.address.number).toBe("123");
        expect(result.address.complement).toBe("Complement 1");
        expect(result.address.city).toBe("City 1");
        expect(result.address.state).toBe("State 1");
        expect(result.address.zipCode).toBe("123456789");
        expect(result.total).toBe(100);
        expect(result.createdAt).toBeDefined();
        
    });
});