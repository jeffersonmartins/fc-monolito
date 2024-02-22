import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';
export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('orders', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false
    },
    client_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    total: {
      type: DataTypes.NUMBER,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  })
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('orders')
} 
