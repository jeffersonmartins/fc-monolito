import { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto } from "./find-invoice.facade.dto";
import { GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./generate-invoice.facade.dto";

export interface InvoiceFacadeInterface {
    generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto>;
    find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto>;
}