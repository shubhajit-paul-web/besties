/**
 * validate register user data using zod
 * check is user already exists using username or email or phone number
 * check is otp already generated if yes then send the ttl as response
 * if otp doesn't exists then generate and store it in redis
 * then send the otp to user's provided email
 */
