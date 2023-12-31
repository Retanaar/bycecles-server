import { IBycecle } from "../bycecle.model";
import { IByceclesStats } from "./byceclesStats";

export interface ByceclesList {
  data: IBycecle[];
  stats: IByceclesStats;
}
