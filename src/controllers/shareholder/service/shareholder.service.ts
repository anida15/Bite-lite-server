import Shareholder from "../../../models/Shareholder";
import {
  createShareholderSchema,
  deleteShareholderSchema,
  getShareholderByIdSchema,
  updateShareholderSchema,
} from "../schema/shareholder";

interface Response {
  data?:
    | {
        shareholders?: Shareholder[];
        total?: number;
        page?: number;
        limit?: number;
        totalPages?: number;
      }
    | Shareholder[]
    | null
    | unknown;
  status: number;
  message: string;
}

class ShareholderService {
  public static async getAllShareholders(
    page: number,
    limit: number
  ): Promise<Response> {
    try {
      const total = await Shareholder.count();

      const shareholders = await Shareholder.findAll({
        limit: limit,
        offset: (page - 1) * limit,
        order: [["created_at", "DESC"]],
      });

      const totalPages = Math.ceil(total / limit);

      return {
        data: {
          shareholders: shareholders,
          total: total,
          page: page,
          limit: limit,
          totalPages: totalPages,
        },
        status: 200,
        message: "Shareholders fetched successfully",
      };
    } catch (error: unknown) {
      return {
        data: {
          shareholders: [],
          total: 0,
          page: 0,
          limit: 0,
          totalPages: 0,
        },
        status: 500,
        message: "Error fetching shareholders: " + error,
      };
    }
  }

  public static async getShareholderById(id: string): Promise<Response> {
    try {
      const { error } = getShareholderByIdSchema.safeParse({ id });
      if (error) {
        return {
          data: null,
          status: 400,
          message: error.message,
        };
      }
      const shareholder = await Shareholder.findByPk(id);
      if (!shareholder) {
        return {
          data: null,
          status: 404,
          message: "Shareholder not found",
        };
      }
      return {
        data: shareholder,
        status: 200,
        message: "Shareholder fetched successfully",
      };
    } catch (error: unknown) {
      return {
        data: null,
        status: 500,
        message: "Error fetching shareholder: " + error,
      };
    }
  }

  public static async createShareholder(
    shareholderData: any
  ): Promise<Response> {
    try {
      const { error } = createShareholderSchema.safeParse(shareholderData);
      if (error) {
        return {
          data: null,
          status: 400,
          message: error.message,
        };
      }

      // Check if email already exists
      const existingShareholder = await Shareholder.findOne({
        where: { email: shareholderData.email },
      });

      if (existingShareholder) {
        return {
          data: null,
          status: 409,
          message: "Email already registered as shareholder",
        };
      }

      const newShareholder = await Shareholder.create(shareholderData);
      return {
        data: newShareholder,
        status: 201,
        message: "Shareholder created successfully",
      };
    } catch (error: unknown) {
      return {
        data: null,
        status: 500,
        message: "Error creating shareholder: " + error,
      };
    }
  }

  public static async updateShareholder(
    id: string,
    shareholderData: any
  ): Promise<Response> {
    try {
      const { error } = updateShareholderSchema.safeParse({
        id,
        shareholder: shareholderData,
      });
      if (error) {
        return {
          data: null,
          status: 400,
          message: error.message,
        };
      }

      const shareholder = await Shareholder.findByPk(id);
      if (!shareholder) {
        return {
          data: null,
          status: 404,
          message: "Shareholder not found",
        };
      }

      // Check if email is being updated and if it already exists
      if (
        shareholderData.email &&
        shareholderData.email !== shareholder.email
      ) {
        const existingShareholder = await Shareholder.findOne({
          where: { email: shareholderData.email },
        });

        if (existingShareholder) {
          return {
            data: null,
            status: 409,
            message: "Email already registered as shareholder",
          };
        }
      }

      await Shareholder.update(shareholderData, { where: { id } });
      const updatedShareholder = await Shareholder.findByPk(id);

      return {
        data: updatedShareholder,
        status: 200,
        message: "Shareholder updated successfully",
      };
    } catch (error: unknown) {
      return {
        data: null,
        status: 500,
        message: "Error updating shareholder: " + error,
      };
    }
  }

  public static async deleteShareholder(id: string): Promise<Response> {
    try {
      const { error } = deleteShareholderSchema.safeParse({ id });
      if (error) {
        return {
          data: null,
          status: 400,
          message: error.message,
        };
      }
      const deletedShareholder = await Shareholder.destroy({ where: { id } });
      if (!deletedShareholder) {
        return {
          data: null,
          status: 404,
          message: "Shareholder not found",
        };
      }
      return {
        data: deletedShareholder,
        status: 200,
        message: "Shareholder deleted successfully",
      };
    } catch (error: unknown) {
      return {
        data: null,
        status: 500,
        message: "Error deleting shareholder: " + error,
      };
    }
  }
}

export default ShareholderService;
