import mongoose from "mongoose";
import BycecleModel, { IBycecle, Status } from "./bycecle.model";
import { IByceclesStats } from "./types/byceclesStats";
import { IByceclesActions } from "./types/byceclesActions";

export class BycecleService implements IByceclesActions {
  async addOne(data: IBycecle): Promise<IBycecle> {
    const bycecle = new BycecleModel({
      _id: new mongoose.Types.ObjectId(),
      ...data,
    });

    return await bycecle.save();
  }
  async findOneBySlug(slug: string): Promise<IBycecle | null> {
    const query = BycecleModel.where({ slug });
    return await query.findOne();
  }
  async getAll(): Promise<IBycecle[]> {
    return await BycecleModel.find({});
  }
  async removeBySlug(slug: string): Promise<IBycecle | null> {
    return await BycecleModel.findOneAndDelete({ slug });
  }
  async updateRecord(
    slug: string,
    values: Partial<IBycecle>
  ): Promise<IBycecle | null> {
    return await BycecleModel.findOneAndUpdate({ slug }, { ...values });
  }
  async getStats(): Promise<IByceclesStats> {
    const result = await BycecleModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          busy: {
            $sum: {
              $cond: {
                if: { $eq: ["$status", Status.BUSY] },
                then: 1,
                else: 0,
              },
            },
          },
          available: {
            $sum: {
              $cond: {
                if: { $eq: ["$status", Status.AVAILABLE] },
                then: 1,
                else: 0,
              },
            },
          },
          averagePrice: { $avg: "$price" },
        },
      },
    ]);
    const {
      total = 0,
      busy = 0,
      available = 0,
      averagePrice = 0,
    } = result[0] ? result[0] : {};
    return {
      available,
      total,
      busy,
      averagePrice,
    };
  }
}
