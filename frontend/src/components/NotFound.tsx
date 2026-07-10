import { Link } from "react-router-dom";
import Button from "./shared/Button";

const NotFound = () => {
	return (
		<div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6 antialiased text-[#1d1d1f] font-sans">
			<div className="relative w-full max-w-xl text-center space-y-12 py-12">
				{/* Abstract Minimalist Visual Centerpiece */}
				<div className="relative flex items-center justify-center h-44 w-full select-none">
					{/* Subtle Outer Glow / Shadow Ring */}
					<div className="absolute w-40 h-40 bg-linear-to-b from-black/3 to-transparent rounded-full blur-xl" />

					{/* Main 404 Display */}
					<div className="relative flex items-center tracking-tighter font-bold text-[9rem] sm:text-[11rem] leading-none text-transparent bg-clip-text bg-linear-to-b from-[#1d1d1f] via-[#1d1d1f] to-[#86868b]">
						4{/* Minimalist interactive/animated inner zero ring */}
						<span className="inline-block mx-1 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-10 sm:border-12 border-dashed border-[#e5e5e7] animate-[spin_80s_linear_infinite]" />4
					</div>
				</div>

				{/* Text content wrapped for clean spacing */}
				<div className="space-y-4 max-w-md mx-auto">
					<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">Page not found.</h1>
					<p className="text-base sm:text-lg text-[#86868b] font-normal leading-relaxed">The page you are looking for doesn't exist, or has been permanently moved to a new address.</p>
				</div>

				{/* Interactive Action Hub */}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xs sm:max-w-none mx-auto pt-2">
					<Link
						to="/app/home"
						className="w-full sm:w-auto px-6 py-3 bg-[#1d1d1f] text-white text-sm font-medium rounded-full hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-[#1d1d1f] focus:ring-offset-2 transition-all duration-200">
						Go Home
					</Link>

					<Button onClick={() => window.history.back()} variant="lightUltra" borderRadius="full" className="py-3 px-6" borderColor="#e5e5e7">
						Go Back
					</Button>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
