import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { loginUrl } from "./api-url";
import { Observable } from "rxjs";

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
  id?: number;
  domain?: string;
  title?: string;
  name?: string;
  department?: string;
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

    return this.http.post<any>(loginUrl + query, {
      username: username,
      password: password
    });
  }

  // logOut not used from the moment
  // all client are redirect
  logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");

    window.location.href = "/";
  }

  getLoginProviders() {
    return this.http.get<any>(loginUrl + "/providers");
  }
}
