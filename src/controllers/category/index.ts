import { Request, Response } from "express";
import Category from "../../models/Category";


class CategoryController {
    public static async getAllCategories(req: Request, res: Response) {
        try {
            const categories = await Category.findAll();
            res.json(categories);
            return;
        } catch (error: unknown) {
            res.status(500).json({ message: "Error getting categories", error: error });
            return;
        }
    }

    public static async getCategoryById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);
            res.json(category);
            return;
        } catch (error: unknown) {
            res.status(500).json({ message: "Error getting category", error: error });
            return;
        }
    }

    public static async createCategory(req: Request, res: Response) {
        try {
            const { name, description } = req.body;
            const category = await Category.create({ name, description });
            res.json(category);
            return;
        } catch (error: unknown) {
            res.status(500).json({ message: "Error creating category", error: error });
            return;
        }
    }

    public static async updateCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            const category = await Category.update({ name, description }, { where: { id } });
            res.json(category);
            return;
        } catch (error: unknown) {
            res.status(500).json({ message: "Error updating category", error: error });
            return;
        }
    }

    public static async deleteCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await Category.destroy({ where: { id } });
            res.json({ message: "Category deleted successfully" });
            return;
        } catch (error: unknown) {
            res.status(500).json({ message: "Error deleting category", error: error });
            return;
        }
    }
}

export default CategoryController;






























