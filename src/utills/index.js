import { decompressSync } from "fflate";

export function fnDecompressData(b64Data, rettype) {
    // Decode base64 (convert ascii to binary)
    const strData = atob(b64Data);

    // Convert binary string to character-number array
    const charData = strData.split("").map(function(x) {
        return x.charCodeAt(0);
    });

    // Turn number array into byte-array
    const binData = new Uint8Array(charData);

    // fflate magic
    try {
        const data = decompressSync(binData);
        const response = data.reduce(function(data, byte) {
        return data + String.fromCharCode(byte);
        }, "");

        if (rettype) return response;
        else return JSON.parse(response);
    } catch (error) {
        console.log("error", error);
        return {};
    }
}