import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "./user.service";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
import { FormControl, Validators } from "@angular/forms";
import { loginUrl } from "src/api-url";
import { Router } from "@angular/router";

export interface DialogData {
  email: string;
  password: string;
}

@Component({
  selector: "lib-user",
  template: `
  <div class="user-content">
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <mat-icon class="md-36">account_circle</mat-icon>
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
      <button mat-menu-item>
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
    `
  ]
})
export class UserComponent implements OnInit {
  token: string;
  email: string;
  password: string;

  translation = [
    { setting: "Setting" },
    { signOut: "Sign Out" },
    { profule: "Profile" },
    { userName: "User Name" },
    { userNameRequireError: "userNameRequireError" },
    { requiredFild: "This fild is required" },
    { login: "Login" }
  ];

  constructor(
    public translateService: TranslateService,
    public userService: UserService,
    public dialog: MatDialog,
    private router: Router
  ) {
    if (!localStorage.getItem("language")) {
      localStorage.setItem("language", "es");
    }

    this.translateService.setDefaultLang(localStorage.getItem("language"));
    this.translateService.use(localStorage.getItem("language"));
  }

  ngOnInit() {
    this.token = localStorage.getItem("token");
    if (!this.token) {
      this.openDialog();
    }
    if (this.token) {
      this.userService.validate();
    }
  }

  logOut() {
    localStorage.removeItem("token");
    // redirect
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginDialog, {
      width: "450px",
      data: { email: this.email, password: this.password }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      console.log(result);
      window.location.href = loginUrl;
    });
  }
}

@Component({
  selector: "login-dialog",
  template: `
  <mat-toolbar class="login-modal-toolbar" color="primary"> {{ 'login' | translate }}</mat-toolbar>

    <form class="login-form">

      <mat-form-field class="login-full-width">
        <input matInput placeholder="{{'userName' | translate}}" [formControl]="userFormControl">
        <mat-error *ngIf="userFormControl.hasError('user') && !userFormControl.hasError('required')">
          {{ 'userNameRequireError' | translate}}
        </mat-error>
        <mat-error *ngIf="userFormControl.hasError('required')">
        {{ 'requiredFild' | translate}}
        </mat-error>

      </mat-form-field>
        <mat-form-field class="login-full-width">
        <input matInput placeholder="{{'password' | translate}}" [formControl]="passwordFormControl">
        <mat-error *ngIf="passwordFormControl.hasError('email') && !passwordFormControl.hasError('required')">
          {{ 'passwardRequireError' | translate}}
        </mat-error>
        <mat-error *ngIf="passwordFormControl.hasError('required')">
        {{ 'requiredFild' | translate}}
        </mat-error>
      </mat-form-field>

      <div align="end">
        <button class="btn-login" mat-raised-button color="accent">Accent</button>
      </div>
    </form>
  `,
  styles: [
    `
      .login-form {
        min-width: 150px;
        max-width: 500px;
        width: 100%;
      }

      .login-full-width {
        width: 100%;
      }
      .btn-login {
        position: relative;
        right: 0px;
        margin: 0;
      }

      .login-modal-toolbar {
        margin: -24px;
        margin-bottom: 0;
        width: auto;
        margin-bottom: 10px;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class LoginDialog {
  userFormControl = new FormControl("", [Validators.required]);
  passwordFormControl = new FormControl("", [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<LoginDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
