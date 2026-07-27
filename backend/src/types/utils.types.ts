import { Request } from "express";

// Strongly typed Express request body, params, and query
export interface TypedRequest<Body = unknown, Params = unknown, Query = unknown> extends Request {
    body: Body;
    params: Params & Request["params"];
    query: Query & Request["query"];
}
