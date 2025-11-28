import { Request, Response } from "express";
import SaleService from "./service/sale.service";


class SaleController {
    public static async getAllSales(req: Request, res: Response) {
        try {
            const { page, limit } = req.query as unknown as { page: number, limit: number };
            const sales = await SaleService.getAllSales(page, limit);
            res.status(sales.status).json(sales);
            return;
        } catch (error: unknown) {
            res.status(500).json({ status: 500, message: "Error getting sales", error: error });
            return;
        }
    }

    public static async getSaleById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const sale = await SaleService.getSaleById(id);
            res.status(sale.status).json(sale);
            return;
        } 
        catch (error: unknown) {
            res.status(500).json({ status: 500, message: "Error getting sale", error: error });
            return;
        }
    }

    public static async createSale(req: Request, res: Response) {
        try {
            const sale = req.body;
            const newSale = await SaleService.createSale(sale);
            res.status(newSale.status).json(newSale);
            return;
        } catch (error: unknown) {
            res.status(500).json({ status: 500, message: "Error creating sale", error: error });
            return;
        }
    }

    public static async updateSale(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const sale = req.body;
            const updatedSale = await SaleService.updateSale(id, sale);
            res.status(updatedSale.status).json(updatedSale);
            return;
        } catch (error: unknown) {
            res.status(500).json({ status: 500, message: "Error updating sale", error: error });
            return;
        }
    }

    public static async deleteSale(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletedSale = await SaleService.deleteSale(id);
            res.status(deletedSale.status).json(deletedSale);
            return;
        } catch (error: unknown) {
            res.status(500).json({ status: 500, message: "Error deleting sale", error: error });
            return;
        }
    }
}

export default SaleController;


