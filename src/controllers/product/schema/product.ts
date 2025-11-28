import { z } from "zod";

export const getAllProductsSchema = z.object({
    page: z.number().min(1).optional(),
    limit: z.number().min(1).optional(),
});

export const createProductSchema = z.object({
    name: z.string().min(1),
    price: z.number().min(0),
    image: z.string().min(1),
    category_id: z.number().min(1),
    description: z.string().optional(),
});

export const updateProductSchema = z.object({
    name: z.string().min(1),
    price: z.number().min(0),
    image: z.string().min(1),
    category_id: z.number().min(1),
});

export const deleteProductSchema = z.object({
    id: z.string().min(1),
});

export const getProductByIdSchema = z.object({
    id: z.string().min(1),
});























