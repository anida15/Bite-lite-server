import { Router } from "express";
import CategoryController from "../../controllers/category/index";

const router = Router();

router.get("/", CategoryController.getAllCategories);
router.post("/", CategoryController.createCategory);
router.post("/bulk", CategoryController.createBulkCategories);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);
router.get("/:id", CategoryController.getCategoryById);

export default router;

















