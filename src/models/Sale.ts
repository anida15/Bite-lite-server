import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface SaleAttributes {
  id: string;
  product_id: string;
  quantity: number;
  total_amount: number;
  sale_date: Date;
  readonly created_at: Date;
  readonly updated_at: Date;
}

interface SaleCreationAttributes
  extends Optional<SaleAttributes, "id" | "created_at" | "updated_at"> {}

class Sale
  extends Model<SaleAttributes, SaleCreationAttributes>
  implements SaleAttributes
{
  public id!: string;
  public product_id!: string;
  public quantity!: number;
  public total_amount!: number;
  public sale_date!: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  
}

Sale.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    sale_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "sales",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);


export default Sale;
