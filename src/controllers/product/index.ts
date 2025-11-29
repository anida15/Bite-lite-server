import { Request, Response } from "express";
import Product from "../../models/Product";
import ProductsService from "./service/products.service";
 

class ProductController {
    public static async getAllProducts(req: Request, res: Response) {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const page = req.query.page ? Number(req.query.page) : 1;
            const category_id = req.query.category_id ? Number(req.query.category_id) : undefined;
            const search = req.query.search ? String(req.query.search) : undefined;

            if (isNaN(limit) || limit < 1) {
                 res.status(400).json({ 
                    status: 400, 
                    message: "Invalid limit parameter. Must be a positive number." 
                });
                return;
            }
            if (isNaN(page) || page < 1) {
                 res.status(400).json({ 
                    status: 400, 
                    message: "Invalid page parameter. Must be a positive number." 
                });
                return;
            }

            const products = await ProductsService.getAllProducts(limit, page, category_id, search);
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
            const product = await ProductsService.getProductById(id);
            res.status(product.status).json(product);
            return;
        } catch (error: unknown) {
            res.status(500).json({ status: 500, message: "Error getting product", error: error });
            return;
        }
    }

    public static async createProduct(req: Request, res: Response) {
        try {
            const { name, price, description, image, category_id } = req.body;
            const product = await ProductsService.createProduct({ name, price, description, image, category_id });
            res.status(product.status).json(product);
            return;
        } catch (error: unknown) {
            res.status(500).json({ status: 500, message: "Error creating product", error: error });
            return;
        }
    }

    public static async updateProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, price, description, image, category_id } = req.body;
            const product = await ProductsService.updateProduct(id, { name, price, description, image, category_id });
            res.status(product.status).json(product);
            return;
        } catch (error: unknown) {
            res.status(500).json({ status: 500, message: "Error updating product", error: error });
            return;
        }
    }

    public static async createBulkProducts(req: Request, res: Response) {
        try {
            const { products } = req.body;
            const result = await ProductsService.createBulkProducts(products);
            return res.status(result.status).json(result);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ 
                status: 500, 
                message: "Error creating bulk products", 
                error: errorMessage 
            });
        }
    }   

    public static async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await ProductsService.deleteProduct(id);
            res.status(product.status).json(product);
            res.status(200).json({ status: 200, message: "Product deleted successfully" });
            return;
        } catch (error: unknown) {
            res.status(500).json({ status: 500, message: "Error deleting product", error: error });
            return;
        }
    }
}

export default ProductController;