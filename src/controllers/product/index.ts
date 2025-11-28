import { Request, Response } from "express";
import Product from "../../models/Product";
import ProductsService from "./service/products.service";
 

class ProductController {
    public static async getAllProducts(req: Request, res: Response) {
        try {
            const { limit, page , category_id  } = req.query as unknown as { limit: number, page: number, category_id: number };

            const products = await ProductsService.getAllProducts(limit, page, category_id);
            res.status(products.status).json(products);
            return;
        } catch (error: unknown) {
            res.status(500).json({ status: 500, message: "Error getting products", error: error });
            return;
        }
    }

    public static async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id);
            res.json(product);
            return;
        } catch (error: unknown) {
            res.status(500).json({ message: "Error getting product", error: error });
            return;
        }
    }

    public static async createProduct(req: Request, res: Response) {
        try {
            const { name, price, image, category_id } = req.body;
            const product = await Product.create({ name, price, image, category_id });
            res.json(product);
            return;
        } catch (error: unknown) {
            res.status(500).json({ message: "Error creating product", error: error });
            return;
        }
    }

    public static async updateProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, price, image, category_id } = req.body;
            const product = await Product.update({ name, price, image, category_id }, { where: { id } });
            res.json(product);
            return;
        } catch (error: unknown) {
            res.status(500).json({ message: "Error updating product", error: error });
            return;
        }
    }

    public static async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await Product.destroy({ where: { id } });
            res.json({ message: "Product deleted successfully" });
            return;
        } catch (error: unknown) {
            res.status(500).json({ message: "Error deleting product", error: error });
            return;
        }
    }
}

export default ProductController;