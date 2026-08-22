import { Link } from "react-router-dom";
import loginPageIllustration from "../../../assets/images/login-page-illustration.svg";
import Button from "../../../components/ui/Button/Button";
import { useForm } from "react-hook-form";
import InputField from "../../../components/ui/InputField";
import type { LoginFormPayload } from "../types/login.types";
import useLoginUser from "../hooks/useLoginUser";

const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormPayload>();

	// Login user
	const { isSubmitting, handleLoginUser } = useLoginUser();

	return (
		<div className="bg-slate-100 h-screen flex justify-center items-center">
			<div className="bg-white w-280 p-20 rounded-3xl flex justify-between items-center gap-20">
				<img className="w-2/5" src={loginPageIllustration} loading="lazy" />

				<div className="w-2 h-80 bg-slate-100"></div>

				<div className="w-full">
					<h1 className="font-medium text-xl text-slate-800 mb-8">Log in to Besties</h1>

					<form onSubmit={handleSubmit(handleLoginUser)} className="space-y-4">
						<InputField
							type="text"
							placeholder="Username or email"
							{...register("identifier", {
								required: "Username or email is required",
							})}
							error={errors.identifier}
						/>

						<InputField type="password" placeholder="Password" {...register("password", { required: "Password is required" })} error={errors.password} />

						<Button variant="pink" type="submit" width="100%" borderRadius="full" centerContent className="py-3 mt-2" disabled={isSubmitting}>
							{isSubmitting ? "Login..." : "Login"}
						</Button>
					</form>
					<Link to="/forgot-password" className="block w-full text-center bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 transition-all py-2.5 rounded-full font-medium mt-3">
						Forgotten password?
					</Link>
					<Link to="/signup" className="block w-full text-center bg-white border border-[#FF3D94] hover:bg-pink-50 text-[#FF3D94] transition-all py-2.5 rounded-full font-medium mt-10">
						Create new account
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
