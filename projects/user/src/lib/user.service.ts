import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { loginUrl, profileUrl, translationUrl } from "./api-url";
import { Observable, Subject } from "rxjs"; // important form compile

export interface Auth {
  access_token: string;
  refresh_token: string;
  expires_in: string;
  user: User;
}
export interface LoginProvides {
  Name: string;
  Type: string;
  Domain: string;
  DomainUrlIcon: string;
}

export interface User {
  name: string;
  profile_picture_url: string;
  language: string;
  country: string;
  email: string;
  applications: [Application];
}

export interface Application {
  id: string;
  isAdmin: boolean;
  alias: string;
  appUrl: string;
  apiUrl: string;
  imageUrl: string;
}

export interface AppToken {
  access_token: string;
  refresh_token: string;
  expire_in: string;
}

export interface DescriptedToken {
  applicationId: string;
  aud: string;
  exp: number;
  iat: number;
  nbf: number;
  role: string;
}

@Injectable({
  providedIn: "root"
})
export class UserService {
  d_token: DescriptedToken; // decripted token
  error = new Subject<any>();
  headers = new HttpHeaders().append(
    "Authorization",
    localStorage.getItem("token")
  );

  refreshAppToken = new Subject();

  constructor(private http: HttpClient) {}

  /**
   * login user
   * @param username
   * @param password
   * @param provider
   */
  signIn(username: string, password: string, provider: string) {
    let query: string;

    if (provider == undefined || provider == null || provider == "") {
      query = "";
    } else {
      query = "?domain=" + provider.toLowerCase();
    }
    return this.http.post<Auth>(loginUrl + query, {
      username: username,
      password: password
    });
  }
  /**
   * send refresh token to server
   * @param expired_token
   */
  refrehToken(expired_token) {
    let newHeaders = new HttpHeaders().append(
      "Authorization",
      "Bearer " + expired_token
    );
    return this.http.get<AppToken>(
      loginUrl +
        "/refresh?refresh_token=" +
        localStorage.getItem("refresh_token"),
      {
        headers: newHeaders
      }
    );
  }

  /**
   * send a valid global token and app id to generate token
   * token sended with header
   * @param token
   * @param appId
   */
  getAppToken(token, appId) {
    // this.checkToken(token);
    /**
     * asign token to new heders and send the app id to generate token
     */

    let newHeaders = new HttpHeaders().append(
      "Authorization",
      "Bearer " + token
    );
    return this.http.get<AppToken>(loginUrl + "/application/" + appId, {
      headers: newHeaders
    });
  }

  /**
   *
   * @param token
   * het profalie from base token an sav to current user on local storage
   */
  getProfile(token) {
    this.checkToken(token);
    let newHeaders = new HttpHeaders().append(
      "Authorization",
      "Bearer " + token
    );

    return this.http.get<User>(profileUrl, {
      headers: newHeaders
    });
  }

  // logOut not used from the moment
  // all client are redirect
  logOut() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    currentUser.applications.map(async app => {
      localStorage.removeItem("token_" + app.alias);
    });

    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  }

  getLoginProviders() {
    return this.http.get<LoginProvides>(loginUrl + "/providers");
  }

  async checkToken(token) {
    /**
     * decripted token
     * expire date
     */
    if (token) {
      let base64Url = token.split(".")[1];
      let base64 = base64Url.replace("-", "+").replace("_", "/");
      this.d_token = JSON.parse(window.atob(base64));

      let now = new Date().getTime() / 1000;

      let timeLeft = Number(this.d_token.exp) - Math.ceil(Number(now));

      if (timeLeft <= 10) {
        // console.log(timeLeft);
        // refrest token
        this.refrehToken(token).subscribe(
          async data => {
            //if server result=true
            if (data) {
              await this.getProfile(data.access_token).subscribe(data => {
                localStorage.setItem("currentUser", JSON.stringify(data));
              });

              /**
               * store local data to server
               * remove loader and close dialog
               */
              await localStorage.setItem("token", data.access_token);
              await localStorage.setItem("refresh_token", data.refresh_token);
            }
          },
          error => {
            /**
             * if server error open snackbar form login component
             */
            // this.error.next(error);
            this.logOut();
          }
        );
      }
    }
  }

  getAppTokenFirstLogin(data: User) {
    this.refreshAppToken.next(data);
  }

  getTranslation(lang) {
    // console.log(lang);
    // return this.http.get(translationUrl + lang);
    return this.http.get(translationUrl + lang);
  }
}
