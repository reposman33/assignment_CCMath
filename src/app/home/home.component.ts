import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import * as randomWords from "random-words";
import { fromEvent, Observable, Subscription } from "rxjs";

export interface IEntry {
  name: string;
  description: string;
  status: string;
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild("query") query: ElementRef;
  subscriptions = new Subscription();

  data: IEntry[];
  page = 1;
  pageSize = 20;
  emptyArray = new Array(1000);
  filteredData: IEntry[];

  ngOnInit() {
    this.data = [];

    for (let i = 0; i < 10000; i++) {
      this.data.push({
        name: randomWords({ exactly: 3, join: " " }),
        description: randomWords({ exactly: 100, join: " " }),
        status: ["new", "submitted", "failed"][Math.floor(Math.random() * 3)],
      });
    }

    this.populateFilteredData("");
  }

  ngAfterViewInit() {
    this.subscriptions.add(
      fromEvent(this.query.nativeElement, "input").subscribe(
        (e: KeyboardEvent) => this.updateFilter(e)
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  populateFilteredData(filter) {
    if (!filter) {
      this.filteredData = this.data.slice();
    }

    this.filteredData = this.data.filter((entry) => {
      return (
        entry.name.indexOf(filter) !== -1 ||
        entry.description.indexOf(filter) !== -1 ||
        entry.status.indexOf(filter) !== -1
      );
    });
  }

  updateFilter($event: KeyboardEvent) {
    this.populateFilteredData(($event.target as HTMLInputElement).value);
  }
}
