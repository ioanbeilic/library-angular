import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UserService, User } from "./user.service";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
  MatIconRegistry,
  MatDialogConfig,
  MatSnackBar
} from "@angular/material";
import { FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { transition } from "@angular/animations";

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
    </button>
    <mat-menu #menu="matMenu">
      <a href="#" mat-menu-item>
        <mat-icon>perm_identity</mat-icon>
        <span>{{'Profile' | translate}}</span>
      </a>
      <a href="#" mat-menu-item>
        <mat-icon>settings</mat-icon>
        <span>{{'Setting' | translate}}</span>
      </a>
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

      div > .login-modal {
        -webkit-box-shadow: 99px 97px 158px -8px rgba(34, 34, 34, 1);
        -moz-box-shadow: 99px 97px 158px -8px rgba(34, 34, 34, 1);
        box-shadow: 99px 97px 158px -8px rgba(34, 34, 34, 1);

        background: url("https://cdn.urbaser.com/img/background/logo.svg")
          no-repeat center center;
        background-size: 350px;
        background-position: 50% 50px;
      }

      .login-modal > .mat-dialog-container {
        background: inherit !important;
        box-shadow: inset 0 0 0 900px rgba(255, 255, 255, 0.7);
        //opacity: 0.5;
      }

      .login-modal {
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
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
  appName: string;
  appId: string;
  appToken: string;
  refreshToken: string;
  expireIn: number;
  validTimeToken: number;
  currentUser: User;
  error;
  errorMessage;

  translation = [
    { setting: "Setting" },
    { signOut: "Sign Out" },
    { profule: "Profile" },
    { username: "User Name" },
    { usernameRequireError: "usernameRequireError" },
    { requiredFild: "This fild is required" },
    { login: "Login" },
    { send: "Send" },
    { "401": " Wrong Username or Password " },
    { "403": " Wrong Username or Password " },
    { "500": " Server error, try again later " }
  ];

  constructor(
    public translateService: TranslateService,
    public userService: UserService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    if (!localStorage.getItem("language")) {
      localStorage.setItem("language", "es");
    }

    this.translateService.setDefaultLang(localStorage.getItem("language"));
    this.translateService.use(localStorage.getItem("language"));
  }

  async ngOnInit() {
    // get local token
    this.token = await localStorage.getItem("token");
    this.refreshToken = await localStorage.getItem("refresh_token");

    if (this.token) {
      await this.userService.checkToken(this.token);
    }

    // get local datta aplication
    this.appName = await localStorage.getItem("appName"); // needed
    this.appId = await localStorage.getItem("appId"); // needed

    this.appToken = await localStorage.getItem("token_" + this.appName);

    if (!this.appToken) {
      /**
       * if token is valid get the app token
       */
      this.userService
        .getAppToken(this.token, this.appId)
        .subscribe(async data => {
          await localStorage.setItem(
            "token_" + this.appName,
            data.access_token
          );
        });
    }

    /**
     * if dont exist app id -- ??
     * if dont exist token open login
     */

    if (!this.token) {
      await this.openDialog();
      // setTimeout(() => this.dialog.open(LoginDialog), 0);
    }

    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

    this.userService.error.subscribe(data => {
      this.error = data.error;
      this.errorMessage = true;
      //this.openSnackBar(data.error.status, "x");
    });
  }

  logOut() {
    this.userService.logOut();
    // redirect
  }

  async openDialog() {
    /**
     * new instance of dialod
     */
    const dialogConfig = new MatDialogConfig();
    dialogConfig.backdropClass = "login-dialog";

    const dialogRef = await this.dialog.open(LoginDialog, {
      width: "600px",
      // panelClass: "login-modal",
      /**
       * passing parameters to dialog
       */
      data: {
        username: this.username,
        password: this.password,
        provider: this.provider
      }
    });

    /**
     * action after close dialog
     * fiture implemantation
     */

    await dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      // window.location.href = loginUrl;
    });
  }
}

/////////////////////////////// modal component

@Component({
  selector: "login-dialog",
  template: `


  
  <h3>{{ 'login' | translate }}</h3>

  <hr>

  <mat-spinner class="loading-spinner" *ngIf="loading" color="accent"></mat-spinner>
 
  <div class="login-modal" *ngIf="!loading">

      <form  (submit)="onLogin()" class="login-form" style="flex:50;">
        <mat-form-field class="login-full-width">
          <input autocomplete="new-email" matInput placeholder="{{'username' | translate}}" name="username" [formControl]="userFormControl">
          <mat-error *ngIf="userFormControl.hasError('user') && !userFormControl.hasError('required')">
            {{ 'usernameRequireError' | translate}}
          </mat-error>
          <mat-error *ngIf="userFormControl.hasError('required')">
          {{ 'requiredFild' | translate}}
          </mat-error>

        </mat-form-field>
          <mat-form-field class="login-full-width">
          <input autocomplete="new-password" type="password" matInput placeholder="{{'password' | translate}}" name="password" [formControl]="passwordFormControl">
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


      <mat-list *ngIf="activeSocialLogin" class="social-login" style="flex:50;" role="list">
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
        margin-top: 20px;
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
      .error-msg {
        display: block;
        margin: 0 auto;
      }
      .error-snackbar {
        //background: rgba(255, 0, 0, 0.7);
        font-size: 1rem;
        color: #f7ca30;
      }

      .error-snackbar button {
        position: absolute;
        right: 0;
        bootom: 0;
        min-height: 100%;
        font-size: 1.5rem;
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
  activeSocialLogin: boolean = true; // hide social login
  errorMessage: boolean = false;
  error;

  user: User;

  constructor(
    public dialogRef: MatDialogRef<LoginDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public userService: UserService,
    public snackBar: MatSnackBar,
    public translateService: TranslateService
  ) {
    /**
     * register svg icon for socvial network
     */
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

    /**
     * get proveder from the server fro select box
     * on html is foltred using corporate fild
     *
     */
    userService.getLoginProviders().subscribe(data => {
      this.providers = data;
    });

    // remove click-out to close
    this.dialogRef.disableClose = true;
  }

  /**
   * asybc login waiting to load data from server
   */

  async onLogin() {
    this.loading = true;
    await this.userService

      .signIn(
        this.userFormControl.value,
        this.passwordFormControl.value,
        this.providerFormControl.value
      )
      .subscribe(
        async data => {
          //if server result=true
          if (data.access_token) {
            await this.userService
              .getProfile(data.access_token)
              .subscribe(data => {
                console.log(data);
                localStorage.setItem("currentUser", JSON.stringify(data));
              });

            /**
             * store local data to server
             * remove loader and close dialog
             */

            await localStorage.setItem("token", data.access_token);
            await localStorage.setItem("refresh_token", data.refresh_token);

            this.loading = true;
            await this.dialogRef.close("Confirm");
          }
        },
        error => {
          /**
           * if server error open snackbar
           */
          this.error = error;
          this.loading = false;
          this.errorMessage = true;
          this.openSnackBar(error.status, "x");
        }
      );
  }

  onNoClick(): void {
    //this.dialogRef.close();
  }
  /**
   * action close the snack bar
   * message waitin the translation from the server for 401, 403 code
   * incorect username or password
   */

  openSnackBar(code: number, action: string) {
    if (code == 401 || code == 403) {
      this.translateService.get("401").subscribe((data: string) => {
        this.snackBar.open(data, action, {
          duration: 90000,
          panelClass: ["error-snackbar"]
        });
      });
    }
  }
}
