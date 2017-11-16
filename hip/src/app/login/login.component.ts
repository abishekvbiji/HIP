import { AuthenticationService } from './../service/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../service/alert.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { config } from "../config";

@Component({
  moduleId: module.id,
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.less']
})

export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  isToken = false;
  config = new config();
  returnUrl: string;
  signinForm: FormGroup;
  forgotPwdForm: FormGroup;
  submitted: boolean;
  forgotPassword: boolean = false;
  emailSubmitted: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.signinForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}'),
        Validators.required])],
      password: ['', Validators.required]
    });

    this.forgotPwdForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}'),
        Validators.required])]
    });
  }

  generateOTP() {
    this.loading = true;
    this.isToken = true;
    this.authenticationService.generateOTP(this.model.phoneNumber)
      .subscribe(
      data => {
        this.loading = false;
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      });
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.phoneNumber, this.model.token)
      .subscribe(
      data => {
        this.router.navigate([this.returnUrl]);
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      });
  }
}
