import type { ImageWithFallbackProps } from "@/types/global.types";

const ImageWithFallback = ({ src, fallback, ...props }: ImageWithFallbackProps) => {
	return (
		<img
			{...props}
			src={src || fallback}
			onError={(e) => {
				e.currentTarget.onerror = null;
				e.currentTarget.src = fallback;
			}}
		/>
	);
};

export default ImageWithFallback;
