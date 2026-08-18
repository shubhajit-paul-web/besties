import type { ImgHTMLAttributes } from "react";

export interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
	fallback: string;
}
