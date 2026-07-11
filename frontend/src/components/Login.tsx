import { Link } from "react-router-dom";
import loginPageIllustration from "../assets/login-page-illustration.svg";
import Button from "./shared/Button";
import { useForm } from "react-hook-form";
import InputField from "./shared/InputField";

const Login = () => {
	interface FormData {
		identifier: string;
		password: string;
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const onSubmit = (data: FormData) => {
		console.log(data);
	};

	return (
		<div className="bg-slate-100 h-screen flex justify-center items-center">
			<div className="bg-white w-280 p-20 rounded-3xl flex justify-between items-center gap-20">
				<img className="w-2/5" src={loginPageIllustration} />

				<div className="w-2 h-80 bg-slate-100"></div>

				<div className="w-full">
					<h1 className="font-medium text-xl text-slate-800 mb-8">Log in to Besties</h1>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<InputField
							type="text"
							placeholder="Email address or mobile number"
							{...register("identifier", {
								required: "Email or mobile is required",
								validate: (value) => {
									const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
									const mobile = /^\d{10}$/;

									return email.test(value) || mobile.test(value) || "Enter a valid email or 10-digit mobile number";
								},
							})}
							error={errors.identifier}
						/>

						<InputField type="password" placeholder="Password" {...register("password", { required: "Password is required" })} error={errors.password} />

						<Button variant="pink" type="submit" width="100%" borderRadius="full" centerContent className="py-3 mt-2">
							Login
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
