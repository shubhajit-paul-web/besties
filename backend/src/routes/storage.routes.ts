// import { Router } from "express";
// import authenticate from "../middlewares/auth.middleware.js";
// import validate from "../middlewares/validator.middleware.js";
// import storageController from "../controllers/storage.controller.js";
// import { downloadFileSchema, uploadFileSchema } from "../validators/storage.validator.js";

// const router = Router();

// router.use(authenticate);

// // (Private) /storage/download
// router.post("/download", validate(downloadFileSchema), storageController.downloadFile);

// // (Private) /storage/upload
// router.post("/upload", validate(uploadFileSchema), storageController.uploadFile);

// export default router;
