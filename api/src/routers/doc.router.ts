import { Router } from "express";
import { getAllDocumentations, getDocumentation } from "../views/doc.view";
import { verifyToken } from "../middlewares/auth.middleware";
import { deleteAllDocumentations, deleteDocumentation } from "../controllers/doc.controller";

const docsRouters = Router();

docsRouters.delete("/rm-all", verifyToken, deleteAllDocumentations);
docsRouters.delete("/rm", verifyToken, deleteDocumentation);

docsRouters.get("/show-all", verifyToken, getAllDocumentations);
docsRouters.get("/show/:_id", verifyToken, getDocumentation);

export default docsRouters;