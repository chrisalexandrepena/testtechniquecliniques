
import dotenv from "dotenv";
import request from "request-promise-native";
import { bodyGen } from "./bodyGen";
dotenv.config();

(async function() {
    const existingClinics: string[] = [];
    while (true) {
        const nbConsecutiveCalls = Math.random() < 0.2 ? 2 : 1;
        const newTimeout = nbConsecutiveCalls === 1 ? Math.round(Math.random() * 10 * 1000) : 100;
        const destUrl = process.env.DEST_URL;
        const body = bodyGen(existingClinics);
        if (body.type === "newClinic") {
            existingClinics.push(body.data.clinicName);
        } else if (body.type === "clinicRemoved") {
            existingClinics.splice(existingClinics.findIndex(clinic => clinic === body.data.clinicName), 1);
        }
        await new Promise(resolve => setTimeout(resolve, newTimeout));

        await request({ method: "POST", uri: destUrl, json: body });
    }
})();
