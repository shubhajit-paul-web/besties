import z from "zod";

export type RequestValidationSchema = z.ZodObject<{
    body?: z.ZodType;
    params?: z.ZodType;
    query?: z.ZodType;
}>;

// Converts all properties of a type to string
export type Stringify<T> = {
    [K in keyof T]: string;
};
