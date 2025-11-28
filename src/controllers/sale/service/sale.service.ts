import Sale from "../../../models/Sale";
import { createSaleSchema, deleteSaleSchema, getSaleByIdSchema, updateSaleSchema } from "../schema/sale";


interface Response {
    data?: {
        sales?: Sale[];
        total?: number;
        page?: number;
        limit?: number;
        totalPages?: number;
    } | Sale[] | null | unknown;
    status: number;
    message: string;
}

class SaleService {
    public static async getAllSales(page: number, limit: number): Promise<Response> {
        try {
            const total = await Sale.count();

            const sales = await Sale.findAll({
                limit: limit,
                offset: (page - 1) * limit,
                order: [["created_at", "DESC"]],
            });

            const totalPages = Math.ceil(total / limit);

            return {
                data: {
                    sales: sales,
                    total: total,
                    page: page,
                    limit: limit,
                    totalPages: totalPages,
                },
                status: 200,
                message: "Sales fetched successfully",
            };
        } catch (error: unknown) {
            return {
                data: {
                    sales: [],
                    total: 0,
                    page: 0,
                    limit: 0,
                    totalPages: 0,
                },
                status: 500,
                message: "Error fetching sales: " + error,
            };
        }
    }

    public static async getSaleById(id: string): Promise<Response> {
        try {
            const { error } = getSaleByIdSchema.safeParse({ id });
            if (error) {
                return {
                    data: null,
                    status: 400,
                    message: error.message,
                };
            }
            const sale = await Sale.findByPk(id);
            if (!sale) {
                return {
                    data: null,
                    status: 404,
                    message: "Sale not found",
                };
            }
            return {
                data: sale,
                status: 200,
                message: "Sale fetched successfully",
            };
        } catch (error: unknown) {
            return {
                data: null,
                status: 500,
                message: "Error fetching sale: " + error,
            };
        }
    }

    public static async createSale(sale: Sale): Promise<Response> {
        try {
            const { error } = createSaleSchema.safeParse(sale);
            if (error) {
                return {
                    data: null,
                    status: 400,
                    message: error.message,
                };
            }
            const newSale = await Sale.create(sale);
            return {
                data: newSale,
                status: 201,
                message: "Sale created successfully",
            };
        } catch (error: unknown) {
            return {
                data: null,
                status: 500,
                message: "Error creating sale: " + error,
            };
        }
    }
    
    public static async updateSale(id: string, sale: Sale): Promise<Response> {
        try {
            const { error } = updateSaleSchema.safeParse({ id, sale });
            if (error) {
                return {
                    data: null,
                    status: 400,
                    message: error.message,
                };
            }
            const updatedSale = await Sale.update(sale, { where: { id } });
            if (!updatedSale) {
                return {
                    data: null,
                    status: 404,
                    message: "Sale not found",
                };
            }
            return {
                data: updatedSale,
                status: 200,
                message: "Sale updated successfully",
            };
        } catch (error: unknown) {
            return {
                data: null,
                status: 500,
                message: "Error updating sale: " + error,
            };
        }
    }
    
    public static async deleteSale(id: string): Promise<Response> {
        try {
            const { error } = deleteSaleSchema.safeParse({ id });
            if (error) {
                return {
                    data: null,
                    status: 400,
                    message: error.message,
                };
            }
            const deletedSale = await Sale.destroy({ where: { id } });
            if (!deletedSale) {
                return {
                    data: null,
                    status: 404,
                    message: "Sale not found",
                };
            }
            return {
                data: deletedSale,
                status: 200,
                message: "Sale deleted successfully",
            };
        } catch (error: unknown) {
            return {
                data: null,
                status: 500,
                message: "Error deleting sale: " + error,
            };
        }
    }
}
export default SaleService;






















