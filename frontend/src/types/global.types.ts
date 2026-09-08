import type { ImgHTMLAttributes } from "react";

export type ImageWithFallbackProps = ImgHTMLAttributes<HTMLImageElement> & {
	fallback: string;
};

export type CallStatus = "pending" | "calling" | "incoming" | "rejected" | "connected" | "canceled" | "failed" | "ended";
