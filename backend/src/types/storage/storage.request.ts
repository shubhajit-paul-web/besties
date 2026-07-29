/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request } from "express";
import type { SupportedFileType } from "./storage.service.js";

export type DownloadFileRequest = Request<{}, {}, { path: string }>;

export type UploadFileRequest = Request<{}, {}, { path: string; type: SupportedFileType }>;
