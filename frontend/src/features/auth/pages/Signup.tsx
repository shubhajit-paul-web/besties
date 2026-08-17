import { useState } from "react";
import UpdateProfilePicture from "../components/Signup/UpdateProfilePicture";
import InitiateRegistration from "../components/Signup/InitiateRegistration";
import VerifyOtp from "../components/Signup/VerifyOtp";
import type { InitiateRegistrationFormPayload } from "../types/registration.types";

const Signup = () => {
	const [step, setStep] = useState(1);
	const [submittedFormData, setSubmittedFormData] = useState<InitiateRegistrationFormPayload>();

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
