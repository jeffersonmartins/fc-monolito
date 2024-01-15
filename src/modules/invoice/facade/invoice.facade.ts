import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto } from "./find-invoice.facade.dto";
import { GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./generate-invoice.facade.dto";
import { InvoiceFacadeInterface } from "./invoice.facade.interface";

interface InvoiceFacadeProps {
    generateInvoiceUseCase: GenerateInvoiceUseCase;
    findInvoiceUseCase: FindInvoiceUseCase;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
    private _generateInvoiceUseCase: GenerateInvoiceUseCase;
    private _findInvoiceUseCase: FindInvoiceUseCase;

    constructor(props: InvoiceFacadeProps) {
        this._findInvoiceUseCase = props.findInvoiceUseCase;
        this._generateInvoiceUseCase = props.generateInvoiceUseCase;
    }
    async generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
        return await this._generateInvoiceUseCase.execute(input);
    }
    find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
        return this._findInvoiceUseCase.execute(input);
    }
}