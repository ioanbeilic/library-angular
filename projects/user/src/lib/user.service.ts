import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { loginUrl } from "./api-url";
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

@Injectable({
  providedIn: "root"
})
export class UserService {
  d_token: string; // decripted token
  constructor(private http: HttpClient) {}

  validate() {
    // let token = localStorage.getItem("token");
  }

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

  getProfile(token) {
    return this.http.get<LoginProvides>(loginUrl + "/providers");
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
