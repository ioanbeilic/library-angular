import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { UserAppService } from "./user-app.service";

export interface App {
  id: string;
  name: string;
  icon: number;
  url: number;
}

@Component({
  selector: "lib-user-app",
  template: `
  <div class="app-list">
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <mat-icon>apps</mat-icon>
    </button>
    <mat-menu class="app-menu" #menu="matMenu">

    <mat-grid-list cols="3" rowHeight="1:1" >

    <mat-grid-tile style=" margin:0 auto;">
      <a mat-button class="app-link">
        <mat-icon>home</mat-icon>
        <hr>
        Basic
      </a>
    </mat-grid-tile>   

    <mat-grid-tile style=" margin:0 auto;">
      <a mat-button class="app-link">
        <mat-icon>home</mat-icon>
        <hr>
        Basic
      </a>
    </mat-grid-tile>   

    <mat-grid-tile style=" margin:0 auto;">
      <a mat-button class="app-link">
        <mat-icon>home</mat-icon>
        <hr>
        Basic
      </a>
    </mat-grid-tile>   

    <mat-grid-tile style=" margin:0 auto;">
      <a mat-button class="app-link">
        <mat-icon>home</mat-icon>
        <hr>
        Basic
      </a>
    </mat-grid-tile>   

    

</mat-grid-list>
    </mat-menu>
  <div>
  `,
  styles: [
    `
      .app-menu {
          max-width: none;
          width: 100vw;
          overflow: visible;
        }
        .app-link{
          height:100px; display: flex!important;
          align-items: center;
          justify-content: center;
        }
        .app-list a {
          padding: 10px;
        }
      }
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class UserAppComponent implements OnInit {
  apps: App[];
  constructor(private userAppService: UserAppService) {}

  ngOnInit() {
    this.userAppService.getApps().subscribe(data => {
      this.apps = data.apps;
    });
  }
}
