import { Router } from "express";
import ProductController from "../../controllers/product/index";

const router = Router();

router.get("/", ProductController.getAllProducts);
router.post("/", ProductController.createProduct);
router.post("/bulk", ProductController.createBulkProducts);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);
router.get("/:id", ProductController.getProductById);

export default router;




