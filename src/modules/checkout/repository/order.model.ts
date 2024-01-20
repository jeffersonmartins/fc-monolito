import { Column, HasMany, Model, PrimaryKey, Table, CreatedAt, HasOne, ForeignKey, BelongsTo } from 'sequelize-typescript';
import ClientModel from './client.model';
import OrderItemModel from './order-item.model';

@Table({ tableName: "orders", timestamps: false })
export default class OrderModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @Column({ allowNull: false })
    declare status: string;

    @HasMany(() => OrderItemModel)
    declare items: OrderItemModel[];

    @ForeignKey(() => ClientModel)  
    @Column({ allowNull: true, field: "client_id" })
    declare clientId: string;

    @BelongsTo(() => ClientModel)
    declare client: ClientModel; 

    @Column({ allowNull: false })
    declare total: number;


}
