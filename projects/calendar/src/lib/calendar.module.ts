import { NgModule } from "@angular/core";
import {
  CalendarComponent,
  YearComponent,
  MonthComponent
} from "./calendar.component";

@NgModule({
  imports: [],
  declarations: [CalendarComponent, YearComponent, MonthComponent],
  exports: [CalendarComponent, YearComponent, MonthComponent]
})
export class CalendarModule {}
