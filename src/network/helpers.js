import { 
    APPLICATION_NAME,
    ACCESS_TOKEN,
    APP_VERSION,
    DEVICE_ID,
    CLIENT_IP,
    ACCESS_TOKEN_TEMP,
    AUTHORIZATION,
    HEADER_TOKEN,
    TOKEN,
    TRADE_TOKEN
} from "../constants/api";

export function isFormData(o) {
 return toString.call(o) === '[object FormData]';
}
  
export function isURLSearchParams(o) {
 return toString.call(o) === '[object URLSearchParams]';
}
  
export function isBlob(o) {
 return toString.call(o) === '[object Blob]';
}

/* for reference only , please upodate this */
export function getHeaders(headers = []) {
    const requestHeader = {}; 
    headers.forEach((header) => {
        switch(header) {
            case APPLICATION_NAME:
                requestHeader[APPLICATION_NAME] = import.meta.env.VITE_APP_APPLICATION_SOURCE;
                break;
            case ACCESS_TOKEN:
                requestHeader[ACCESS_TOKEN] = ACCESS_TOKEN_TEMP;
                break;
            case CLIENT_IP:
                requestHeader[CLIENT_IP] = localStorage.getItem("myip");
                break;
            case DEVICE_ID:
                requestHeader[DEVICE_ID] = localStorage.getItem("deviceid");
                break;
            case APP_VERSION:
                requestHeader[APP_VERSION] = import.meta.env.VITE_APP_VERSION_ID;
                break;
            case AUTHORIZATION:
                requestHeader[AUTHORIZATION] = `Bearer ${TRADE_TOKEN}`;
                break;
            case HEADER_TOKEN:
                requestHeader[HEADER_TOKEN] = TOKEN;
                break;
        }
    });
    return requestHeader;
}
