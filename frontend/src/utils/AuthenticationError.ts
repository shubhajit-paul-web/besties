class AuthenticationError extends Error {
	constructor() {
		super("Authentication failed.");
		this.name = "AuthenticationError";
	}
}

export default AuthenticationError;
