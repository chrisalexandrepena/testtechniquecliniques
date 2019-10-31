import { generate as generateClinicName } from "project-name-generator";
import { getRandomName } from "nodejs-randomnames";
import moment from "moment";
import cityList from "./json/cityList.json";

export type possibleEvents = "newClinic" | "clinicUpdated" | "clinicRemoved" | "newPatientTreated";
class RequestBody {
    type: possibleEvents;
    data: {
        clinicName: string;
        timestamp: string;
        city?: string;
        patientName?: string;
    };
    timestamp: string;
}

export function bodyGen(existingClinics: string[]) {
    const requestBody = new RequestBody();
    const random = Math.random();

    // Defining type
    if (random <= 0.25) {
        requestBody.type = "newClinic";
    } else if (random <= 0.5) {
        requestBody.type = "clinicUpdated";
    } else if (random <= 0.75) {
        requestBody.type = "clinicRemoved";
    } else {
        requestBody.type = "newPatientTreated";
    }

    // Defining data
    switch (requestBody.type) {
        case "newClinic": {
            let newClinicName: { spaced: string } = generateClinicName();
            while (existingClinics.includes(newClinicName.spaced)) {
                newClinicName = generateClinicName();
            }
            requestBody.data = {
                clinicName: newClinicName.spaced,
                timestamp: moment().toISOString(),
                city: cityList[Math.trunc(Math.random() * (cityList.length - 1))],
            };
            break;
        }
        case "clinicUpdated": {
            requestBody.data = {
                clinicName: existingClinics[Math.trunc(Math.random() * (existingClinics.length - 1))],
                timestamp: moment().toISOString(),
                city: cityList[Math.trunc(Math.random() * (cityList.length - 1))],
            };
            break;
        }
        case "clinicRemoved": {
            requestBody.data = {
                clinicName: existingClinics[Math.trunc(Math.random() * (existingClinics.length - 1))],
                timestamp: moment().toISOString(),
            };
            break;
        }
        case "newPatientTreated": {
            requestBody.data = {
                clinicName: existingClinics[Math.trunc(Math.random() * (existingClinics.length - 1))],
                patientName: getRandomName(),
                timestamp: moment().toISOString(),
            };
            break;
        }
    }

    return requestBody;
}
