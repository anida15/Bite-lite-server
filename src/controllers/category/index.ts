import { Request, Response } from "express";
import Category from "../../models/Category";
import CategoriesService from "./service/catrgory.service";


class CategoryController {
    public static async getAllCategories(req: Request, res: Response) {
        try {
            const categories = await CategoriesService.getAllCategories();
            res.status(categories.status).json(categories);
            return;
        } catch (error: unknown) {
            res.status(500).json({ message: "Error getting categories", error: error as string });
            return;
        }
    }

    public static async getCategoryById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const category = await CategoriesService.getCategoryById(id);
            res.status(category.status).json(category);
            return;
        } catch (error: unknown) {
            res.status(500).json({ status: 500, message: "Error getting category", error: error as string });
            return;
        }
    }

    public static async createCategory(req: Request, res: Response) {
        try {
            const { name, description } = req.body;
            const category = await CategoriesService.createCategory({ name, description });
            res.status(category.status).json(category);
            return;
        } catch (error: unknown) {
            res.status(500).json({ status: 500, message: "Error creating category", error: error as string });
            return;
        }
    }
    public static async createBulkCategories(req: Request, res: Response) {
        try {
            const { categories } = req.body;
            const result = await CategoriesService.createBulkCategories(categories);
            return res.status(result.status).json(result);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ 
                status: 500, 
                message: "Error creating bulk categories", 
                error: errorMessage 
            });
        }
    }

    public static async updateCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            const category = await CategoriesService.updateCategory(id, { name, description });
            res.status(category.status).json(category);
            return;
        } catch (error: unknown) {
            res.status(500).json({ status: 500, message: "Error updating category", error: error as string });
            return;
        }
    }

    public static async deleteCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const category = await CategoriesService.deleteCategory(id);
            res.status(category.status).json(category);
            return;
        } catch (error: unknown) {
            res.status(500).json({ status: 500, message: "Error deleting category", error: error as string });
            return;
        }
    }
}

export default CategoryController;






























