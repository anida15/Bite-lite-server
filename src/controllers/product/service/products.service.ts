import Product from "../../../models/Product";
import { createProductSchema, deleteProductSchema, getAllProductsSchema, getProductByIdSchema, updateProductSchema } from "../schema/product";

interface Response {
    data?: Product[] | null | unknown;
    status: number;
    message: string;
}

class ProductsService {
    public static async getAllProducts(limit: number, page: number, category_id?: number): Promise<Response> {
        try {
            const validLimit = Number(limit) || 10;
            const validPage = Number(page) || 1;

            const { error } = getAllProductsSchema.safeParse({ limit: validLimit, page: validPage, category_id });
            if (error) {
                return {
                    data: null,
                    status: 400,
                    message: error.message,
                };
            }

            const whereClause: any = {};
            if (
                category_id !== undefined &&
                category_id !== null &&
                !isNaN(Number(category_id))
            ) {
                whereClause.category_id = Number(category_id);
            }

            const total = await Product.count({
                where: whereClause,
            });

            const products = await Product.findAll({
                where: whereClause,
                limit: validLimit,
                offset: (validPage - 1) * validLimit,
            });

            const totalPages = Math.ceil(total / validLimit);

            return {
                data: {
                    products: products,
                    total: total,
                    page: validPage,
                    limit: validLimit,
                    totalPages: totalPages,
                },
                status: 200,
                message: "Products found successfully",
            };
        } catch (error: unknown) {

            return {
                data: {
                    products: [],
                    total: 0,
                    page: 0,
                    limit: 0,
                    totalPages: 0,
                },
                status: 500,
                message: "Error getting products: " + error,
            };
        }
    }

    public static async getProductById(id: string): Promise<Response> {
        try {
            const { error } = getProductByIdSchema.safeParse({ id });
            if (error) {
                return {
                    data: null,
                    status: 400,
                    message: error.message,
                };
            }
            const product = await Product.findByPk(id);
            if (!product) {
                return {
                    data: {
                        product: null,
                    },
                    status: 404,
                    message: "Product not found",
                };
            }
            return {
                data: {
                    product: product,
                },
                status: 404,
                message: "Product not found",
            };
        } catch (error: unknown) {
            return {
                data: {
                    product: null,
                },
                status: 500,
                message: "Error getting product: " + error,
            };
        }
    }

    public static async createProduct( { name, price, description, image, category_id }: { name: string, price: number, description: string, image: string, category_id: number }): Promise<Response> {
        try {
            const { error } = createProductSchema.safeParse({ name, price, description, image, category_id });
            if (error) {
                return {
                    data: null,
                    status: 400,
                    message: error.message,
                };
            }
            const newProduct = await Product.create({ name, price, description, image, category_id });
            return {
                data: {
                    product: newProduct,
                },
                status: 201,
                message: "Product created successfully",
            };
        } catch (error: unknown) {
            return {
                data: {
                    product: null,
                },
                status: 500,
                message: "Error creating product: " + error,
            };
        }
    }

    public static async createBulkProducts(products: { name: string, price: number, description?: string, image: string, category_id: number }[]): Promise<Response> {
        try {
            if (!Array.isArray(products) || products.length === 0) {
                return {
                    data: null,
                    status: 400,
                    message: "Products must be a non-empty array",
                };
            }

            const validationErrors: string[] = [];
            
            products.forEach((product, index: number) => {
                const result = createProductSchema.safeParse(product);
                if (!result.success) {
                    validationErrors.push(`Product at index ${index}: ${result.error.issues.map((e: any) => e.message).join(", ")}`);
                }
            });

            if (validationErrors.length > 0) {
                return {
                    data: { errors: validationErrors },
                    status: 400,
                    message: "Validation errors",
                };
            }

            const bulkProducts = await Product.bulkCreate(products, {
                validate: true,
                returning: true,
            });

            return {
                data: bulkProducts,
                status: 201,
                message: `${bulkProducts.length} products created successfully`,
            };
        } catch (error: unknown) {
            return {
                data: null,
                status: 500,
                message: "Error creating bulk products: " + error,
            };
        }
    }

    public static async updateProduct(id: string, { name, price, description, image, category_id }: { name: string, price: number, description: string, image: string, category_id: number }): Promise<Response> {
        try {
            const { error } = updateProductSchema.safeParse({ id, name, price, description, image, category_id });
            if (error) {
                return {
                    data: null,
                    status: 400,
                    message: error.message,
                };
            }
            const updatedProduct = await Product.update({ name, price, description, image, category_id }, { where: { id } });
            if (!updatedProduct) {
                return {
                    data: {
                        product: null,
                    },
                    status: 404,
                    message: "Product not found",
                };
            }
            return {
                data: {
                    product: updatedProduct[0],
                },
                status: 200,
                message: "Product updated successfully",
            };
        } catch (error: unknown) {
            return {
                data: {
                    product: null,
                },
                status: 500,
                message: "Error updating product: " + error,
            };
        }
    }
    public static async deleteProduct(id: string): Promise<Response> {
        try {
            const { error } = deleteProductSchema.safeParse({ id });
            if (error) {
                return {
                    data: null,
                    status: 400,
                    message: error.message,
                };
            }
            const deletedProduct = await Product.destroy({ where: { id } });
            if (!deletedProduct) {
                return {
                    data: {
                        product: null,
                    },
                    status: 404,
                    message: "Product not found",
                };
            }
            return {
                data: {
                    product: deletedProduct,
                },
                status: 200,
                message: "Product deleted successfully",
            };
        } catch (error: unknown) {
            return {
                data: {
                    product: null,
                },
                status: 500,
                message: "Error deleting product: " + error,
            };
        }
    }
}

export default ProductsService;





















