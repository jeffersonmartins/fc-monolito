import Address from "../../@shared/domain/value-object/address"
import Id from "../../@shared/domain/value-object/id.value-object"

export type InvoiceAddressProps = {
    id?: Id
    street: string
    number: string
    complement: string
    city: string
    state: string
    zipCode: string
}

export default class InvoiceAddress extends Address {
    private _id: Id;

    constructor(props: InvoiceAddressProps) {
        super(props.street, props.number, props.complement, props.city, props.state, props.zipCode);
        this._id = props.id || new Id();
    }

    get id(): Id {
        return this._id;
    }
}