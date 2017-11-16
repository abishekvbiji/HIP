import { Patient } from './../models/patient';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
    constructor(private http: Http) { }
    generateOTP(phoneNumber: string) {
        let body = 'user=' + phoneNumber;
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let options = new RequestOptions({ headers: headers });
        return this.http.post('/sendToken', body, options)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                const resp = response.json();
                if (resp.success) {
                    console.log('Ask For OTP');
                }
            });
    }

    login(phoneNumber: string, otp: string) {
        return this.http.post('/verify', JSON.stringify({ token: otp }))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                const resp = response.json();
                const patient = new Patient();
                if (resp.success) {
                    patient.phoneNumber = phoneNumber;
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentPatient', JSON.stringify(patient));
                }

                return patient;
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}