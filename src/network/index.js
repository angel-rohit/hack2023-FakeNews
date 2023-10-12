import HttpClient from "./HttpClient";
import config from "./config";
import { getHeaders } from "./helpers";

export const networkClient = (endpoint, data, headers = {}, method = "get") => {
    const requestMap = config[endpoint];
    const options = {
        method: requestMap['method'] || method,
        body: data,
        headers: { ...getHeaders(requestMap?.headers), ...headers, "Content-type": requestMap["contentType"] || "application/json" }
    };
    const baseURL = 
    requestMap["baseURL"] == undefined
      ? import.meta.env.VITE_BASE_URL
      : import.meta.env["VITE_BASE_URL_" + requestMap["baseURL"]];
    return HttpClient.fetch(`${baseURL}${requestMap.url}`, options);
};