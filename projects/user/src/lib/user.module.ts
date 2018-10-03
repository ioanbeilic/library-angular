import { NgModule } from "@angular/core";
import { UserComponent, LoginDialog } from "./user.component";
import { MaterialModule } from "./material.module";
import { HttpClient, HttpClientModule } from "@angular/common/http";

import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    /*
    `http://desarrollo.urbaser.com/Intranet/OrgChart/organization-chart-`,
    ".json"
    */
    `https://devintranet.urbaser.com/urbaserws/translate/organization-chart-`,
    ".json"
  );
}

@NgModule({
  imports: [
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [UserComponent, LoginDialog],
  exports: [UserComponent],
  entryComponents: [UserComponent, LoginDialog]
})
export class UserModule {}
