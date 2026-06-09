import { Router } from "express";
import ShareholderController from "../../controllers/shareholder/";

const router = Router();

router.get("/", ShareholderController.getAllShareholders);
router.post("/", ShareholderController.createShareholder);
router.put("/:id", ShareholderController.updateShareholder);
router.delete("/:id", ShareholderController.deleteShareholder);
router.get("/:id", ShareholderController.getShareholderById);

export default router;
