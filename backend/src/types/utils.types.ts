import z from "zod";

export type RequestValidationSchema = z.ZodObject<{
    body?: z.ZodType;
    params?: z.ZodType;
    query?: z.ZodType;
}>;
