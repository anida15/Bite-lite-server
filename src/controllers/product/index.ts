import { Request, Response } from "express";
import Product from "../../models/Product";
import ProductsService from "./service/products.service";
 

class ProductController {
    public static async getAllProducts(req: Request, res: Response) {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const page = req.query.page ? Number(req.query.page) : 1;
            const category_id = req.query.category_id ? Number(req.query.category_id) : undefined;

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

    public static async createBulkProducts(req: Request, res: Response) {
        try {
            const { products } = req.body;

            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).json({ 
                    status: 400, 
                    message: "Products must be a non-empty array" 
                });
            }
            const { createProductSchema } = await import("./schema/product");
            const validationErrors: string[] = [];
            
            products.forEach((product: any, index: number) => {
                const result = createProductSchema.safeParse(product);
                if (!result.success) {
                    validationErrors.push(`Product at index ${index}: ${result.error.issues.map((e: any) => e.message).join(", ")}`);
                }
            });

            if (validationErrors.length > 0) {
                return res.status(400).json({ 
                    status: 400, 
                    message: "Validation errors", 
                    errors: validationErrors 
                });
            }
            const bulkProducts = await Product.bulkCreate(products, {
                validate: true,
                returning: true,
            });

            return res.status(201).json({ 
                status: 201,
                message: `${bulkProducts.length} products created successfully`,
                data: bulkProducts 
            });
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