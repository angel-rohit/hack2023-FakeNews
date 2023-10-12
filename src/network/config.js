import { 
    APPLICATION_NAME,
    ACCESS_TOKEN,
    APP_VERSION,
    DEVICE_ID,
    CLIENT_IP,
} from "../constants/api";

const ApiConfig = {
    profile: {
        url: "/v1/profile",
        headers: [APPLICATION_NAME, CLIENT_IP, APP_VERSION, DEVICE_ID, ACCESS_TOKEN]
    },
};
export default ApiConfig;