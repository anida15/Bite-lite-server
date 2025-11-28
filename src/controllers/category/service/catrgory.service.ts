import Category from "../../../models/Category";
import { createCategorySchema, deleteCategorySchema, getAllCategoriesSchema, getCategoryByIdSchema, updateCategorySchema } from "../schema/category";


interface Response {
    data?: Category[] | null | unknown;
    status: number;
    message: string;
}

class CategoryService {
    public static async getAllCategories(): Promise<Response> {
        try {
            const { error } = getAllCategoriesSchema.safeParse({});
            if (error) {
                return {
                    data: null,
                    status: 400,
                    message: error.message,
                };
            }
            const categories = await Category.findAll();
            if (!categories) {
                return {
                    data: null,
                    status: 404,
                    message: "Categories not found",
                };
            }
            return {
                data: categories,
                status: 200,
                message: "Categories found successfully",
            };
        }
        catch (error: unknown) {
            return {
                data: null,
                status: 500,
                message: "Error getting categories: " + error,
            };
        }
    }
    public static async getCategoryById(id: string): Promise<Response> {
        try {
            const { error } = getCategoryByIdSchema.safeParse({ id });
            if (error) {
                return {
                    data: null,
                    status: 400,
                    message: error.message,
                };
            }
            const category = await Category.findByPk(id);
            if (!category) {
                return {
                    data: null,
                    status: 404,
                    message: "Category not found",
                };
            }
            return {
                data: category,
                status: 200,
                message: "Category found successfully",
            };
        } catch (error: unknown) {
            return {
                data: null,
                status: 500,
                message: "Error getting category: " + error,
            };
        }
    }
    public static async createCategory(category: Category): Promise<Response> {
        try {
            const { error } = createCategorySchema.safeParse(category);
            if (error) {
                return {
                    data: null,
                    status: 400,
                    message: error.message,
                };
            }
            const newCategory = await Category.create(category);
            return {
                data: newCategory,
                status: 201,
                message: "Category created successfully",
            };
        }
        catch (error: unknown) {
            return {
                data: null,
                status: 500,
                message: "Error creating category: " + error,
            };
        }
    }
    public static async updateCategory(id: string, category: Category): Promise<Response> {
        try {
            const { error } = updateCategorySchema.safeParse({ id, category });
            if (error) {
                return {
                    data: null,
                    status: 400,
                    message: error.message,
                };
            }
            const updatedCategory = await Category.update(category, { where: { id } });
            if (!updatedCategory) {
                return {
                    data: null,
                    status: 404,
                    message: "Category not found",
                };
            }
            return {
                data: updatedCategory,
                status: 200,
                message: "Category updated successfully",
            };
        }
        catch (error: unknown) {
            return {
                data: null,
                status: 500,
                message: "Error updating category: " + error,
            };
        }
    }
    public static async deleteCategory(id: string): Promise<Response> {
        try {
            const { error } = deleteCategorySchema.safeParse({ id });
            if (error) {
                return {
                    data: null,
                    status: 400,
                    message: error.message,
                };
            }
            const deletedCategory = await Category.destroy({ where: { id } });
            if (!deletedCategory) {
                return {
                    data: null,
                    status: 404,
                    message: "Category not found",
                };
            }
            return {
                data: deletedCategory,
                status: 200,
                message: "Category deleted successfully",
            };
        }
        catch (error: unknown) {
            return {
                data: null,
                status: 500,
                message: "Error deleting category: " + error,
            };
        }
    }
}
export default CategoryService;














