import type { ImgHTMLAttributes } from "react";

export type ImageWithFallbackProps = ImgHTMLAttributes<HTMLImageElement> & {
	fallback: string;
};
