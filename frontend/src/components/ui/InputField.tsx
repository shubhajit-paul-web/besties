import { Info } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import type { FieldError } from "react-hook-form";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	error?: FieldError;
};

const InputField = ({ error, ...props }: InputFieldProps) => {
	return (
		<div>
			<input className={`w-full py-3.5 px-5 rounded-xl border  ${error ? "border-red-500 focus:outline-red-500" : "border-slate-300 focus:outline-slate-400"}`} {...props} />
			{error && (
				<p className="text-sm text-red-500 mt-0.5 flex items-center gap-1">
					<Info size={15} />
					{error.message}
				</p>
			)}
		</div>
	);
};

export default InputField;
