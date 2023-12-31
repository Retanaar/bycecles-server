import { IBycecle } from "../bycecle.model";
import { IByceclesStats } from "./byceclesStats";

export interface IByceclesActions {
  addOne(data: IBycecle): Promise<IBycecle>;
  findOneBySlug(slug: string): Promise<IBycecle | null>;
  getAll(): Promise<IBycecle[]>;
  removeBySlug(slug: string): Promise<IBycecle | null>;
  updateRecord(
    slug: string,
    values: Partial<IBycecle>
  ): Promise<IBycecle | null>;
  getStats(): Promise<IByceclesStats>;
}
