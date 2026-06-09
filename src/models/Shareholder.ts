import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface ShareholderAttributes {
  id: string;
  first_name: string;
  middle_name?: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  share_amount: number; // Amount in dollars (minimum $100)
  number_of_shares: number; // Calculated based on share_amount
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  identification_type: string; // e.g., 'passport', 'national_id', 'drivers_license'
  identification_number: string;
  nationality: string;
  date_of_birth: Date;
  agreement_signed: boolean;
  agreement_date?: Date;
  notes?: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}

interface ShareholderCreationAttributes
  extends Optional<
    ShareholderAttributes,
    "id" | "middle_name" | "number_of_shares" | "payment_status" | "agreement_signed" | "agreement_date" | "notes" | "created_at" | "updated_at"
  > {}

class Shareholder
  extends Model<ShareholderAttributes, ShareholderCreationAttributes>
  implements ShareholderAttributes
{
  public id!: string;
  public first_name!: string;
  public middle_name?: string;
  public surname!: string;
  public email!: string;
  public phone!: string;
  public address!: string;
  public share_amount!: number;
  public number_of_shares!: number;
  public payment_status!: 'pending' | 'completed' | 'failed' | 'refunded';
  public identification_type!: string;
  public identification_number!: string;
  public nationality!: string;
  public date_of_birth!: Date;
  public agreement_signed!: boolean;
  public agreement_date?: Date;
  public notes?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  
  // Virtual field to get full name
  public get full_name(): string {
    return this.middle_name 
      ? `${this.first_name} ${this.middle_name} ${this.surname}`
      : `${this.first_name} ${this.surname}`;
  }
}

Shareholder.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "First name is required",
        },
      },
    },
    middle_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Surname is required",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Must be a valid email address",
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Phone number is required",
        },
      },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Address is required",
        },
      },
    },
    share_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [100],
          msg: "Minimum share purchase amount is $100",
        },
        isDecimal: {
          msg: "Share amount must be a valid number",
        },
      },
    },
    number_of_shares: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "Number of shares cannot be negative",
        },
      },
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    identification_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['passport', 'national_id', 'drivers_license', 'other']],
          msg: "Invalid identification type",
        },
      },
    },
    identification_number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Identification number is required",
        },
      },
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Nationality is required",
        },
      },
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isBefore: new Date().toISOString().split('T')[0],
      },
    },
    agreement_signed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    agreement_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: "shareholders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        name: "idx_shareholder_email",
        unique: true,
        fields: ["email"],
      },
      {
        name: "idx_shareholder_payment_status",
        fields: ["payment_status"],
      },
      {
        name: "idx_shareholder_created",
        fields: ["created_at"],
      },
    ],
    hooks: {
      beforeValidate: (shareholder: Shareholder) => {
        // Calculate number of shares based on share_amount
        // Assuming $100 per share as base unit
        if (shareholder.share_amount) {
          shareholder.number_of_shares = Math.floor(shareholder.share_amount / 100);
        }
      },
      beforeUpdate: (shareholder: Shareholder) => {
        // Recalculate shares if amount changes
        if (shareholder.changed('share_amount') && shareholder.share_amount) {
          shareholder.number_of_shares = Math.floor(shareholder.share_amount / 100);
        }
        
        // Set agreement_date when agreement_signed becomes true
        if (shareholder.changed('agreement_signed') && shareholder.agreement_signed && !shareholder.agreement_date) {
          shareholder.agreement_date = new Date();
        }
      },
      beforeCreate: (shareholder: Shareholder) => {
        // Set agreement_date if agreement is already signed
        if (shareholder.agreement_signed && !shareholder.agreement_date) {
          shareholder.agreement_date = new Date();
        }
      },
    },
  }
);

export default Shareholder;
