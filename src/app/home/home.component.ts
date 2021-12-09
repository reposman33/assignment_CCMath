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
  @ViewChild("buttonPrev") buttonPrev: ElementRef;
  @ViewChild("buttonNext") buttonNext: ElementRef;
  subscriptions = new Subscription();

  data: IEntry[];
  page = 1;
  pageSize = 10;
  lastPage = 0;
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
    this.lastPage = Math.ceil(this.data.length / this.pageSize);
    this.populateFilteredData("");
  }

  ngAfterViewInit() {
    this.subscriptions.add(
      fromEvent(this.query.nativeElement, "input").subscribe(
        (e: KeyboardEvent) => this.updateFilter(e)
      )
    );
    this.subscriptions.add(
      fromEvent(this.buttonNext.nativeElement, "click").subscribe(
        (e: Event) => {
          e.preventDefault();
          this.page = this.page < this.lastPage ? ++this.page : this.lastPage;
        }
      )
    );
    this.subscriptions.add(
      fromEvent(this.buttonPrev.nativeElement, "click").subscribe(
        (e: Event) => {
          e.preventDefault();
          this.page = this.page > 1 ? --this.page : 1;
        }
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
    this.lastPage = Math.ceil(this.filteredData.length / this.pageSize);
  }

  updateFilter($event: KeyboardEvent) {
    this.populateFilteredData(($event.target as HTMLInputElement).value);
  }
}
