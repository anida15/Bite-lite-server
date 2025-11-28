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

    public static async createProduct(product: Product): Promise<Response> {
        try {
            const { error } = createProductSchema.safeParse(product);
            if (error) {
                return {
                    data: null,
                    status: 400,
                    message: error.message,
                };
            }
            const newProduct = await Product.create(product);
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

    public static async updateProduct(id: string, product: Product): Promise<Response> {
        try {
            const { error } = updateProductSchema.safeParse({ id, product });
            if (error) {
                return {
                    data: null,
                    status: 400,
                    message: error.message,
                };
            }
            const updatedProduct = await Product.update(product, { where: { id } });
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





















