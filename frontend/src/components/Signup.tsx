import { useState } from "react";
import UpdateProfilePicture from "./shared/Signup/UpdateProfilePicture";
import InitiateRegistration from "./shared/Signup/InitiateRegistration";
import VerifyOtp from "./shared/Signup/VerifyOtp";
import type { SignupFormPayload } from "../types/user.types";

const Signup = () => {
	const [step, setStep] = useState(1);
	const [submittedFormData, setSubmittedFormData] = useState<SignupFormPayload>();

	switch (step) {
		case 1:
			return <InitiateRegistration setStep={setStep} setSubmittedFormData={setSubmittedFormData} />;

		case 2:
			return <VerifyOtp setStep={setStep} submittedFormData={submittedFormData} />;

		case 3:
			return <UpdateProfilePicture />;
	}
};

export default Signup;
