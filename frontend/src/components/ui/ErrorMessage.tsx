import { AlertCircle, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

interface ErrorMessageProps {
	title?: string;
	message?: string;
	actionLabel?: string;
	onRetry?: () => void;
	icon?: ReactNode;
	className?: string;
}

const ErrorMessage = ({
	title = "Something went wrong",
	message = "We couldn't load this content. Please try again.",
	actionLabel = "Try again",
	onRetry,
	icon,
	className = "",
}: ErrorMessageProps) => {
	return (
		<div
			className={`flex min-h-65 items-center justify-center rounded-2xl
        border border-slate-100 bg-white p-6 ${className}`}>
			<div className="flex max-w-[320px] flex-col items-center text-center">
				{/* Icon */}
				<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">{icon ?? <AlertCircle className="h-6 w-6 text-red-500" strokeWidth={2} />}</div>

				{/* Content */}
				<h3 className="text-[17px] font-semibold text-slate-900">{title}</h3>

				<p className="mt-1.5 text-sm leading-5 text-slate-500">{message}</p>

				{/* Action */}
				{onRetry && (
					<button
						type="button"
						onClick={onRetry}
						className="
              mt-5 inline-flex items-center gap-2
              rounded-lg bg-slate-900 px-4 py-2
              text-sm font-medium text-white
              transition-all
              hover:bg-slate-800
              active:scale-[0.98]
              focus:outline-none
              focus:ring-2
              focus:ring-slate-300
              focus:ring-offset-2
            ">
						<RefreshCw className="h-3.5 w-3.5" />
						{actionLabel}
					</button>
				)}
			</div>
		</div>
	);
};

export default ErrorMessage;
