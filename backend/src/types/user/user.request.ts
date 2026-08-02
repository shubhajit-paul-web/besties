/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request } from "express";
import type { SupportedFileType } from "../storage/storage.service.js";

export type GenerateAvatarUploadUrlRequest = Request<{}, {}, { type: SupportedFileType }>;

export type UpdateAvatarRequest = Request<{}, {}, { path: string }>;
