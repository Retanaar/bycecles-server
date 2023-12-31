import express from "express";
import { BycecleController } from "../components/bycecle/bycecle.controller";
import { BycecleService } from "../components/bycecle/bycecle.service";
import ByceclesValidator from "../components/bycecle/bycecle.validators";

const controller = new BycecleController(new BycecleService());

const router = express.Router();

router
  .route("/")
  .post(
    ByceclesValidator.validateDataForAdding,
    controller.addBycecle.bind(controller)
  )
  .get(controller.getByceclesList.bind(controller))
  .delete(
    ByceclesValidator.validateIdParam,
    controller.deleteBycecle.bind(controller)
  )
  .patch(
    ByceclesValidator.validateIdParam,
    ByceclesValidator.validateStatus,
    controller.updateStatus.bind(controller)
  );

export = router;
