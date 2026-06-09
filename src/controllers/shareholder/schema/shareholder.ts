import { z } from "zod";

export const createShareholderSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),
  surname: z.string().min(1, "Surname is required"),
  email: z.string().email("Must be a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  share_amount: z.number().min(100, "Minimum share purchase amount is $100"),
  payment_status: z.enum(["pending", "completed", "failed", "refunded"]).optional(),
  identification_type: z.enum(
    ["passport", "national_id", "drivers_license", "other"],
    { message: "Invalid identification type" }
  ),
  identification_number: z.string().min(1, "Identification number is required"),
  nationality: z.string().min(1, "Nationality is required"),
  date_of_birth: z.string().or(z.date()).transform((val) => {
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }),
  agreement_signed: z.boolean().optional(),
  notes: z.string().optional(),
});

export const updateShareholderSchema = z.object({
  id: z.string().uuid("Invalid shareholder ID"),
  shareholder: z.object({
    first_name: z.string().min(1, "First name is required").optional(),
    middle_name: z.string().optional(),
    surname: z.string().min(1, "Surname is required").optional(),
    email: z.string().email("Must be a valid email address").optional(),
    phone: z.string().min(1, "Phone number is required").optional(),
    address: z.string().min(1, "Address is required").optional(),
    share_amount: z.number().min(100, "Minimum share purchase amount is $100").optional(),
    payment_status: z.enum(["pending", "completed", "failed", "refunded"]).optional(),
    identification_type: z.enum(
      ["passport", "national_id", "drivers_license", "other"],
      { message: "Invalid identification type" }
    ).optional(),
    identification_number: z.string().min(1, "Identification number is required").optional(),
    nationality: z.string().min(1, "Nationality is required").optional(),
    date_of_birth: z.string().or(z.date()).transform((val) => {
      if (typeof val === 'string') {
        return new Date(val);
      }
      return val;
    }).optional(),
    agreement_signed: z.boolean().optional(),
    notes: z.string().optional(),
  }),
});

export const getShareholderByIdSchema = z.object({
  id: z.string().uuid("Invalid shareholder ID"),
});

export const deleteShareholderSchema = z.object({
  id: z.string().uuid("Invalid shareholder ID"),
});
