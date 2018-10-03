import { NgModule } from "@angular/core";
import { UserAppComponent } from "./user-app.component";
import { MaterialModule } from "src/app/material.module";

@NgModule({
  imports: [MaterialModule],
  declarations: [UserAppComponent],
  exports: [UserAppComponent]
})
export class UserAppModule {}
