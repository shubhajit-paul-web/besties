const generateOtp = () => {
    return Math.floor(Math.random() * 100000) + 100000;
};

export default generateOtp;
