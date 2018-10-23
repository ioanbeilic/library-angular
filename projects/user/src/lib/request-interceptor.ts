import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errMsg;
        // Client Side Error
        if (error.error instanceof ErrorEvent) {
          errMsg = error.error;
        } else {
          // Server Side Error
          errMsg = error;
        }
        return throwError(errMsg);
      })
    );
  }
}

// send app token to header
export class AddHeaderInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Clone the request to add the new header
    let token = localStorage.getItem("token");
    let clonedRequest;
    if (token) {
      let appName = localStorage.getItem("currentApp");
      let appToken = localStorage.getItem("token_" + appName);
      if (appToken) {
        clonedRequest = req.clone({
          headers: req.headers.set("Authorization", "Bearer " + appToken)
        });
      } else {
        clonedRequest = req.clone({
          headers: req.headers.set("Authorization", "Bearer " + token)
        });
      }
    } else {
      clonedRequest = req.clone();
    }

    // Pass the cloned request instead of the original request to the next handle
    return next.handle(clonedRequest);
  }
}
