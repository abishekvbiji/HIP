import { Component, OnInit } from '@angular/core';
import { Patient } from './../models/patient';
import { PatientService } from '../service/patient.service';

@Component({
  moduleId: module.id,
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {
  currentPatient: Patient;

  constructor(private patientService: PatientService) {
    this.currentPatient = JSON.parse(localStorage.getItem('currentPatient'));
  }

  ngOnInit() {
  }

}