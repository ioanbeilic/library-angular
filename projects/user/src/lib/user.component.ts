import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "./user.service";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
  MatIconRegistry,
  MatDialogConfig
} from "@angular/material";
import { FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { User } from "user/user";

export interface DialogData {
  username: string;
  password: string;
  provider: string;
}

@Component({
  selector: "lib-user",
  template: `
  <div class="user-content">
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <mat-icon class="md-36">account_circle</mat-icon>
      <span *ngIf="user">{{ user.name}}</span>
    </button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item>
        <mat-icon>perm_identity</mat-icon>
        <span>{{'Profile' | translate}}</span>
      </button>
      <button mat-menu-item>
        <mat-icon>settings</mat-icon>
        <span>{{'Setting' | translate}}</span>
      </button>
      <button mat-menu-item (click)="logOut()">
        <mat-icon>power_settings_new</mat-icon>
        <span>{{'signOut' | translate}}</span>
      </button>
    </mat-menu>
  </div>
  `,
  styles: [
    `
      .user-content {
        padding-right: 20px;
        z-index: 101;
      }

      .cdk-overlay-backdrop {
        background-image: url("https://cdn.urbaser.com/img/background/background-1.jpg");
        background-repeat: no-repeat;
        background-size: cover;
        height: 100%;
      }
      //cdk-overlay-backdrop cdk-overlay-dark-backdrop cdk-overlay-backdrop-showing
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {
  token: string;
  username: string;
  password: string;
  provider: string;

  translation = [
    { setting: "Setting" },
    { signOut: "Sign Out" },
    { profule: "Profile" },
    { username: "User Name" },
    { usernameRequireError: "usernameRequireError" },
    { requiredFild: "This fild is required" },
    { login: "Login" },
    { send: "Send" },
    { 401: "Wrong Username or Password " }
  ];
  constructor(
    public translateService: TranslateService,
    public userService: UserService,
    public dialog: MatDialog
  ) {
    if (!localStorage.getItem("language")) {
      localStorage.setItem("language", "es");
    }

    this.translateService.setDefaultLang(localStorage.getItem("language"));
    this.translateService.use(localStorage.getItem("language"));
  }

  async ngOnInit() {
    this.token = await localStorage.getItem("token");

    if (!this.token) {
      await this.openDialog();
      // setTimeout(() => this.dialog.open(LoginDialog), 0);
    }
    if (this.token) {
      await this.userService.validate();
    }
  }

  logOut() {
    this.userService.logOut();
    // redirect
  }

  async openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.backdropClass = "login-dialog";

    const dialogRef = await this.dialog.open(LoginDialog, {
      width: "600px",
      data: {
        username: this.username,
        password: this.password,
        provider: this.provider
      }
    });

    await dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      // window.location.href = loginUrl;
    });
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "login-dialog",
  template: `
  <mat-toolbar class="login-modal-toolbar" color="primary"> {{ 'login' | translate }}</mat-toolbar>

  <mat-spinner class="loading-spinner" *ngIf="loading" color="accent"></mat-spinner>

  <div *ngIf="errorMessage && !loading" class="alert">
    <mat-icon class="md-36" color="warn" >warning</mat-icon>
    <span *ngIf="error.status == 401 ||error.status == 403 ">
      {{ '401' | translate }}
    </span>
  </div>

  <div class="login-modal" *ngIf="!loading">

      <form  (submit)="onLogin()" class="login-form" style="flex:50;">
        <mat-form-field class="login-full-width">
          <input matInput placeholder="{{'username' | translate}}" name="username" [formControl]="userFormControl">
          <mat-error *ngIf="userFormControl.hasError('user') && !userFormControl.hasError('required')">
            {{ 'usernameRequireError' | translate}}
          </mat-error>
          <mat-error *ngIf="userFormControl.hasError('required')">
          {{ 'requiredFild' | translate}}
          </mat-error>

        </mat-form-field>
          <mat-form-field class="login-full-width">
          <input type="password" matInput placeholder="{{'password' | translate}}" name="password" [formControl]="passwordFormControl">
          <mat-error *ngIf="passwordFormControl.hasError('email') && !passwordFormControl.hasError('required')">
            {{ 'passwardRequireError' | translate}}
          </mat-error>
          <mat-error *ngIf="passwordFormControl.hasError('required')">
          {{ 'requiredFild' | translate}}
          </mat-error>
        </mat-form-field>

        <mat-form-field class="login-full-width">        
          <mat-select name="provider" [formControl]="providerFormControl" [(value)]="provider" >
                  
            <ng-container *ngFor="let provider of providers">
                <mat-option name="provider" 
                            value="{{provider.name}}" 
                            *ngIf="provider.corporate">
                  {{provider.name}}
                </mat-option>  
            </ng-container>

          </mat-select >
        </mat-form-field>

        <div align="center">
          <button type="submit" class="btn-login"  mat-raised-button color="accent">{{'send' | translate}}</button>
        </div>
      </form>


      <mat-list class="social-login" style="flex:50;" role="list">
        <mat-list-item class="social-login-items" role="listitem">
          <button class="social-login-btn" mat-button style="background-color:#DD4B39">
            <mat-icon svgIcon="google+"></mat-icon>
            <span>Google+</span>
          </button>
        </mat-list-item>
        <mat-list-item class="social-login-items" role="listitem">
          <button class="social-login-btn" mat-button style="background-color:#3A559F">
            <mat-icon svgIcon="facebook"></mat-icon>
            <span>Facebook</span>
          </button>
        </mat-list-item>
        <mat-list-item class="social-login-items" role="listitem">
          <button class="social-login-btn" mat-button style="background-color:#50ABF1">
            <mat-icon svgIcon="twitter"></mat-icon>
            <span>Twitter</span>
          </button>
        </mat-list-item>
        <mat-list-item class="social-login-items" role="listitem">
          <button class="social-login-btn" mat-button style="background-color:#0084B1">
            <mat-icon svgIcon="linkedin"></mat-icon>
            <span>LinkedIn</span>
          </button>
        </mat-list-item>

      </mat-list>
    </div>

  `,
  styles: [
    `
      .login-modal {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
      }

      .login-form {
        min-width: 200px; /* it is smaller than all mobiles. */
        padding: 10px;
      }

      .login-full-width {
        width: 100%;
      }

      .btn-login {
        margin-top: 10px;
      }

      .login-modal-toolbar {
        margin: -24px;
        margin-bottom: 0;
        width: auto;
        margin-bottom: 10px;
      }
      .social-login {
        border-left: 1.5px solid rgba(0, 0, 0, 0.38);
        display: flex;
        flex-direction: column;
        justify-content: right;
        margin-left: 15px;
        min-width: 200px;
      }
      .social-login-btn {
        min-width: 100%;
        text-align: left;
        color: #fff;
      }
      .social-login-btn span {
        padding-left: 20px;
      }
      .loading-spinner {
        display: block;
        margin: 0 auto;
      }

      @media only screen and (max-width: 590px) {
        .social-login {
          border-left: none;
        }
      }
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class LoginDialog {
  userFormControl = new FormControl("", [Validators.required]);
  passwordFormControl = new FormControl("", [Validators.required]);
  providerFormControl = new FormControl("");
  providers: any;
  provider: string;
  //
  loading: boolean = false;
  activeSocialLogin: boolean = true;
  errorMessage: boolean = false;
  error;

  user: User;

  constructor(
    public dialogRef: MatDialogRef<LoginDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public userService: UserService
  ) {
    iconRegistry.addSvgIcon(
      "facebook",
      sanitizer.bypassSecurityTrustResourceUrl("assets/img/facebook.svg")
    );
    iconRegistry.addSvgIcon(
      "google+",
      sanitizer.bypassSecurityTrustResourceUrl("assets/img/google-plus.svg")
    );
    iconRegistry.addSvgIcon(
      "twitter",
      sanitizer.bypassSecurityTrustResourceUrl("assets/img/twitter.svg")
    );
    iconRegistry.addSvgIcon(
      "linkedin",
      sanitizer.bypassSecurityTrustResourceUrl("assets/img/linkedin.svg")
    );

    userService.getLoginProviders().subscribe(data => {
      this.providers = data;
    });

    // remove click-out to close
    this.dialogRef.disableClose = true;
  }

  async onLogin() {
    this.loading = true;
    await this.userService

      .signIn(
        this.userFormControl.value,
        this.passwordFormControl.value,
        this.providerFormControl.value
      )
      .subscribe(
        data => {
          //if server result=true
          if (data.access_token) {
            this.userService.getProfile(data.access_token).subscribe(data => {
              localStorage.setItem("currentUser", JSON.stringify(data));
            });

            localStorage.setItem("token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
            localStorage.setItem("expires_in", data.expires_in);
            this.loading = true;
            this.dialogRef.close("Confirm");
          }
        },
        error => {
          this.error = error;
          this.loading = false;
          this.errorMessage = true;
        }
      );
  }

  onNoClick(): void {
    //this.dialogRef.close();
  }
}
