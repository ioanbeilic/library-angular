import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { loginUrl, profileUrl } from "./api-url";
import { Observable } from "rxjs"; // important form compile

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
  applications: [Aplication];
}

export interface Aplication {
  id: string;
  isAdmin: boolean;
  name: string;
  appUrl: string;
  aìUrl: string;
  imageUrl: string;
}

export interface AppToken {
  token: string;
  refresh_token: string;
  expire_in: string;
}

@Injectable({
  providedIn: "root"
})
export class UserService {
  d_token: string; // decripted token
  headers = new HttpHeaders().append(
    "Authorization",
    localStorage.getItem("token")
  );

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
    //  GET /v1/login/refresh
    let newHeaders = new HttpHeaders().append(
      "Authorization",
      "Bearer " + expired_token
    );
    return this.http.get<AppToken>(
      loginUrl + "/refresh/" + localStorage.getItem("refresh_token"),
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
    let newHeaders = new HttpHeaders().append(
      "Authorization",
      "Bearer " + token
    );
    console.log(newHeaders);
    console.log(profileUrl);
    return this.http.get<LoginProvides>(profileUrl, {
      headers: newHeaders
    });
  }

  // logOut not used from the moment
  // all client are redirect
  logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("currentUser");

    window.location.href = "/";
  }

  getLoginProviders() {
    return this.http.get<LoginProvides>(loginUrl + "/providers");
  }
}
