import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Category from "./Category";
import Sale from "./Sale";

export interface ProductAttributes {
  id: string;
  name: string;
  price: number;
  image: string;
  category_id?: number;
  description?: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}

interface ProductCreationAttributes
  extends Optional<ProductAttributes, "id" | "category_id" | "created_at" | "updated_at"> {}

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: string;
  public name!: string;
  public price!: number;
  public image!: string;
  public category_id?: number;
  public description?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public Category?: string;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "categories",
        key: "id",
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
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
    tableName: "products",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        name: "idx_product_name",
        fields: ["name"],
      },
      {
        name: "idx_product_name_lower",
        fields: [sequelize.fn("lower", sequelize.col("name"))],
      },
    ],
  }
);

Product.belongsTo(Category, {
  foreignKey: "category_id",
  as: "Category",
});

Category.hasMany(Product, {
  foreignKey: "category_id",
  as: "Products",
});

Sale.belongsTo(Product, {
  foreignKey: "product_id",
  as: "Product",
});

Product.hasMany(Sale, {
  foreignKey: "product_id",
  as: "Sales",
});

 

export default Product;

