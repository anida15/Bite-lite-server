import { z } from "zod";

export const createSaleSchema = z.object({
    product_id: z.string().min(1),
    quantity: z.number().min(1),
    total_amount: z.number().min(0),
    sale_date: z.date(),
});

export const updateSaleSchema = z.object({
    product_id: z.string().min(1),
    quantity: z.number().min(1),
    total_amount: z.number().min(0),
    sale_date: z.date(),
});

export const getSaleByIdSchema = z.object({
    id: z.string().min(1),
}); 

export const deleteSaleSchema = z.object({
    id: z.string().min(1),
});































