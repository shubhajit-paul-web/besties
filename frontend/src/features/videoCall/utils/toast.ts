import { toast } from "react-toastify";

export const showErrorToast = (message: string) => {
	toast.error(message, {
		theme: "colored",
		style: {
			width: "fit-content",
			// maxWidth: "90vw",
			paddingRight: "25px",
			whiteSpace: "normal",
			overflowWrap: "normal",
			wordBreak: "normal",
		},
	});
};
