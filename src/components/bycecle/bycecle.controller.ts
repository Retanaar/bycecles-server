import { NextFunction, Request, Response, json, response } from "express";
import { Status } from "./bycecle.model";
import Logging from "../../libs/logging";
import { BycecleService } from "./bycecle.service";
import { IByceclesActions } from "./types/byceclesActions";

export class BycecleController {
  service: BycecleService;
  constructor(service: IByceclesActions) {
    this.service = service;
  }
  async addBycecle(req: Request, res: Response) {
    Logging.log("Try to add new Bycecle");
    const test = await this.service.findOneBySlug(req.body.slug);
    if (test) {
      const error = new Error(
        `Bycecle with slug ${req.body.slug} already exist`
      );
      Logging.error(error);
      Logging.error(req.body);
      res.status(400).json({ message: error.message });
      return;
    }
    this.service
      .addOne({
        color: req.body.color,
        description: req.body.description,
        name: req.body.name,
        slug: req.body.slug,
        type: req.body.type,
        status: Status.AVAILABLE,
        price: parseFloat(req.body.price),
        wheel_size: parseInt(req.body.wheel_size),
      })
      .then((r) => {
        res.status(200).json(r);
        Logging.log(`Add new record with slug [${r.slug}]`);
      })
      .catch((error) => {
        Logging.error(error);
        res.status(500).json({ error });
      });
  }
  async getByceclesList(req: Request, res: Response) {
    // TODO: add paging support
    try {
      const data = await this.service.getAll();
      Logging.log(`Return list with all bycecles. Count ${data.length}`);
      const stats = await this.service.getStats();
      Logging.log("Calculate bycecles list stats");
      Logging.log(stats);
      res.status(200).json({
        data,
        stats,
      });
    } catch (error) {
      Logging.error(error);
      res.status(500).json({ error });
    }
  }
  async deleteBycecle(req: Request, res: Response) {
    Logging.log(`Try to remove record with slug: ${req.query.id}`);
    const id = (req.query.id ?? "").toString();
    this.service
      .removeBySlug(id)
      .then(() => res.status(200).json({ ready: "ok" }))
      .catch((error) => {
        Logging.error("Something happen due deleting");
        Logging.error(error);
        response.status(500).json(error);
      });
  }
  async updateStatus(req: Request, res: Response) {
    const id = (req.query.id ?? "").toString();
    const status = req.body.status;
    Logging.log(`Update record with slug ${id}. New status ${status}`);
    this.service
      .updateRecord(id, { status })
      .then(() => {
        Logging.log("Status has been updated");
        res.status(200).json({ result: "ok" });
      })
      .catch((error) => {
        Logging.error(error);
        res.status(500).json(error);
      });
  }
}
