import { BelongsTo, Column, Model, PrimaryKey, Table } from "sequelize-typescript"
import InvoiceModel from "./invoice.model"

export interface CreationInvoiceItemsModelProps {
    id: string;
    name: string;
    price: number;
    invoiceId?: string;
  }
  
  export interface InvoiceItemsModelProps {
    id: string;
    name: string;
    price: number;
    invoiceId: string;
    invoice: InvoiceModel;
  }
  
@Table({
    tableName: 'invoice_item',
    timestamps: false
})
export default class InvoiceItemModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string

    @Column({ allowNull: false })
    name: string

    @Column({ allowNull: false })
    price: number

    @BelongsTo(() => InvoiceModel, 'invoiceId')
    invoice: InvoiceModel
}