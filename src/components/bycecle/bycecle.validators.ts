import { NextFunction, Request, Response } from "express";
import { IBycecle, Status } from "./bycecle.model";
import Logging from "../../libs/logging";
import { testNumber } from "../../libs/utils";

type keyOfBycecle = keyof IBycecle;

class ByceclesValidator {
  validateDataForAdding(req: Request, res: Response, next: NextFunction) {
    const fields: keyOfBycecle[] = [
      "color",
      "description",
      "name",
      "type",
      "slug",
    ];
    const fnumbers = ["price", "wheel_size"];
    try {
      for (const key in fields) {
        const value = req.body[fields[key]];
        if (!value || !value.toString().trim()) {
          throw new Error(`Field ${fields[key]} cannot be empty`);
        }
        if (value.length < 5) {
          throw new Error(`Field ${fields[key]} must be more than 5 symbols`);
        }
      }
      for (const key in fnumbers) {
        const value = req.body[fnumbers[key]];
        if (!value || !value.toString().trim()) {
          throw new Error(`Field ${fnumbers[key]} cannot be empty`);
        }
        if (!testNumber(value)) {
          throw new Error(`Field ${fnumbers[key]} must be number`);
        }
      }
      next();
    } catch (error: any) {
      Logging.error(error);
      Logging.error(req.body);
      res.status(400).json({ message: error.message });
    }
  }
  validateIdParam(req: Request, res: Response, next: NextFunction) {
    const value = (req.query["id"] ?? "").toString().trim();
    if (!value) {
      Logging.error("Empty id param");
      res.status(500).json({ message: "Empty id param" });
    } else {
      next();
    }
  }
  validateStatus(req: Request, res: Response, next: NextFunction) {
    const value = (req.body["status"] ?? "").toString().trim();
    if (
      !value ||
      (value !== Status.AVAILABLE &&
        value !== Status.UNAVAILABLE &&
        value !== Status.BUSY)
    ) {
      Logging.error("Incorrect status value");
      res.status(400).json({ message: "Incorrect status value" });
    } else {
      next();
    }
  }
}

export = new ByceclesValidator();
