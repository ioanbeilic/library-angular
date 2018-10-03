import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { App } from "./user-app.component";
import { apiUrl } from "src/api-url";
import { Subject } from "rxjs";

export interface Apps {
  apps: App[];
}

@Injectable({
  providedIn: "root"
})
export class UserAppService {
  statusCode = new Subject<any>();

  headers = new HttpHeaders().append(
    "Authorization",
    localStorage.getItem("token")
  );

  constructor(private http: HttpClient, private router: Router) {}

  getApps() {
    return this.http.get<Apps>(apiUrl + "apis", {
      headers: this.headers
    });
  }

  checkPermision(app: App) {
    let appToken = localStorage.getItem("token-" + app.id);

    if (!appToken) {
      let token = localStorage.getItem("token");
      if (token) {
        this.http
          .get(apiUrl + app.id, {
            headers: this.headers,
            observe: "response"
          })
          .subscribe(async res => {
            console.log(res.headers.get("Status Code"));

            this.statusCode.next(res.headers.get("Status Code"));

            if (res.body["permision"]) {
            }

            localStorage.setItem("token-" + app.id, res["token"]);
          });
      }
    }
  }

  goToApp(app: App) {
    this.router.navigate([app.url]);
  }
}
