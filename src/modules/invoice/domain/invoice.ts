import { CreatedAt, UpdatedAt } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import InvoiceAddress from "./invoice-address";
import InvoiceItems from "./invoice-item";

type InvoiceProps = {
    id?: Id,
    name: string,
    document: string,
    address: InvoiceAddress,
    items: InvoiceItems[],
    CreatedAt?: Date,
    UpdatedAt?: Date
}

export default class Invoice extends BaseEntity implements AggregateRoot {

    private _name: string
    private _document: string
    private _address: InvoiceAddress
    private _items: InvoiceItems[]

    constructor(props: InvoiceProps) {
        super(props.id, props.CreatedAt, props.UpdatedAt);
        this._name = props.name;
        this._document = props.document;
        this._address = props.address;
        this._items = props.items;
    }

    get name(): string {
        return this._name;
    }

    get document(): string {
        return this._document;
    }

    get address(): InvoiceAddress {
        return this._address;
    }

    get items(): InvoiceItems[] {
        return this._items;
    }
    
}