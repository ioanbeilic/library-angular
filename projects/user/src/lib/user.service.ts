import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { loginUrl } from "src/api-url";

interface Auth {
  access_token: string;
  refresh_token: string;
  expires_in: string;
  user: User;
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
    let token = localStorage.getItem("token");
  }

  signin(username: string, password: string, domain: string) {
    // console.log(JSON.stringify({ username: username, password: password }));

    return this.http
      .post<Auth>(loginUrl + domain, {
        username: username,
        password: password
      })
      .subscribe(
        data => {
          //if server result=true
          if (data.access_token) {
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
            localStorage.setItem("expires_in", data.expires_in);
            localStorage.setItem("currentUser", JSON.stringify(data.user));

            // decript token -- not userd for the moment
            let base64Url = data.access_token.split(".")[1];
            let base64 = base64Url.replace("-", "+").replace("_", "/");
            this.d_token = JSON.parse(window.atob(base64));
            //------------------------------------------------
            //console.log(this.d_token);
          }
        },
        error => {}
      );
  }

  // logOut not used from the moment
  // all client are redirect
  logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");

    window.location.href = "/";
  }
}
