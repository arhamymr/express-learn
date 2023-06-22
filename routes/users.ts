import express, { Request, Response, NextFunction } from "express";

let router = express.Router();
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.json("respond with a resource");
});

export default router;
