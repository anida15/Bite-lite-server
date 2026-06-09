import { Request, Response } from "express";
import ShareholderService from "./service/shareholder.service";

class ShareholderController {
  public static async getAllShareholders(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query as unknown as {
        page: number;
        limit: number;
      };
      const shareholders = await ShareholderService.getAllShareholders(
        page,
        limit
      );
      res.status(shareholders.status).json(shareholders);
      return;
    } catch (error: unknown) {
      res.status(500).json({
        status: 500,
        message: "Error getting shareholders",
        error: error,
      });
      return;
    }
  }

  public static async getShareholderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const shareholder = await ShareholderService.getShareholderById(id);
      res.status(shareholder.status).json(shareholder);
      return;
    } catch (error: unknown) {
      res.status(500).json({
        status: 500,
        message: "Error getting shareholder",
        error: error,
      });
      return;
    }
  }

  public static async createShareholder(req: Request, res: Response) {
    try {
      const shareholderData = req.body;
      const newShareholder = await ShareholderService.createShareholder(
        shareholderData
      );
      res.status(newShareholder.status).json(newShareholder);
      return;
    } catch (error: unknown) {
      res.status(500).json({
        status: 500,
        message: "Error creating shareholder",
        error: error,
      });
      return;
    }
  }

  public static async updateShareholder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const shareholderData = req.body;
      const updatedShareholder = await ShareholderService.updateShareholder(
        id,
        shareholderData
      );
      res.status(updatedShareholder.status).json(updatedShareholder);
      return;
    } catch (error: unknown) {
      res.status(500).json({
        status: 500,
        message: "Error updating shareholder",
        error: error,
      });
      return;
    }
  }

  public static async deleteShareholder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedShareholder = await ShareholderService.deleteShareholder(
        id
      );
      res.status(deletedShareholder.status).json(deletedShareholder);
      return;
    } catch (error: unknown) {
      res.status(500).json({
        status: 500,
        message: "Error deleting shareholder",
        error: error,
      });
      return;
    }
  }
}

export default ShareholderController;
