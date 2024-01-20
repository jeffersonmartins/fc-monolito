import { Column, Model, PrimaryKey, ForeignKey, Table, BelongsTo } from 'sequelize-typescript';
import OrderModel from './order.model';

@Table({ tableName: "order_items", timestamps: false })
export default class OrderItemModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @Column({ allowNull: false })
    declare name: string;

    @Column({ allowNull: false })
    declare description: string;

    @Column({ allowNull: false })
    declare salesPrice: number;

    @ForeignKey(() => OrderModel)
    @Column({ allowNull: true, field: "order_id" })
    declare orderId: string;

    @BelongsTo(() => OrderModel)
    declare order: OrderModel;
    
}