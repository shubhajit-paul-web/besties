const isDuplicateKeyError = (err: unknown) => {
    return typeof err === "object" && err !== null && "code" in err && err.code === 11000;
};

export default isDuplicateKeyError;
