import { Link } from "react-router-dom";
import loginPageIllustration from "../assets/login-page-illustration.svg";
import Button from "./shared/Button";

const Login = () => {
	return (
		<div className="bg-slate-100 h-screen flex justify-center items-center">
			<div className="bg-white w-280 p-20 rounded-3xl flex justify-between items-center gap-20">
				<img className="w-2/5" src={loginPageIllustration} />

				<div className="w-2 h-80 bg-slate-100"></div>

				<div className="w-full">
					<h1 className="font-medium text-xl text-slate-800 mb-8">Log in to Besties</h1>

					<form className="space-y-4">
						<input className="w-full py-3.5 px-5 rounded-xl border border-slate-300 focus:outline-slate-400" type="text" placeholder="Email address or mobile number" />
						<input className="w-full py-3.5 px-5 rounded-xl border border-slate-300 focus:outline-slate-400" type="password" placeholder="Password" />

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
