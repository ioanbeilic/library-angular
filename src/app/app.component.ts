import { Component } from "@angular/core";

export interface test {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  alias = "holidays";
  title = "nav-bar";

  test: test[] = [
    { text: "One", cols: 3, rows: 1, color: "lightblue" },
    { text: "Two", cols: 1, rows: 2, color: "lightgreen" },
    { text: "Three", cols: 1, rows: 1, color: "lightpink" },
    { text: "Four", cols: 2, rows: 1, color: "#DDBDF1" }
  ];

  navLinks = [
    { linkName: "link 1 more text", icon: "tag", url: "https://google.com" },
    { linkName: "link 2 text", icon: "offline_bolt", url: "test" },
    { linkName: "link 3", icon: "home", url: "test1" },
    { linkName: "link 4", icon: "", url: "test2" },
    { linkName: "link 5", icon: "menu", url: "test3" }
  ];
}
