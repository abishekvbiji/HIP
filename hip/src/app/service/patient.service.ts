import { Patient } from './../models/patient';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Injectable()
export class PatientService {
    constructor(private http: Http) { }

    getAll() {
        return this.http.get('/patients').map((response: Response) => response.json());
    }

    create(patient: Patient) {
        return this.http.post('/patient', patient).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get('/patient/:' + id).map((response: Response) => response.json());
    }

    update(patient: Patient) {
        return this.http.put('/patients/:' + patient.id, patient).map((response: Response) => response.json());
    }

}