import { z } from "zod";

export const getAllCategoriesSchema = z.object({});

export const createCategorySchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
});

export const updateCategorySchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
});

export const deleteCategorySchema = z.object({
    id: z.number().min(1),
});

export const getCategoryByIdSchema = z.object({
    id: z.number().min(1),
});
















