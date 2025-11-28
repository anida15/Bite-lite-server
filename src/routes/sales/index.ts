import { Router } from "express";
import SaleController from "../../controllers/sale/";

const router = Router();

router.get("/", SaleController.getAllSales);
router.post("/", SaleController.createSale);
router.put("/:id", SaleController.updateSale);
router.delete("/:id", SaleController.deleteSale);
router.get("/:id", SaleController.getSaleById); 

export default router;























