import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import * as randomWords from "random-words";
import { fromEvent, Subscription } from "rxjs";

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
  // enable / disable the pagerbuttons
  buttonNextDisabled: boolean = false;
  buttonPrevDisabled: boolean = true;
  subscriptions = new Subscription();

  data: IEntry[];
  page = 1;
  // number of rows per page
  pageSize = 5;
  lastPage = 0;
  emptyArray = new Array(1000);
  filteredData: IEntry[];

  ngOnInit() {
    this.initData();
    this.lastPage = Math.ceil(this.data.length / this.pageSize);
    this.buttonNextDisabled = this.lastPage === 1;
    this.buttonPrevDisabled = this.page === 1;
    this.populateFilteredData("");
  }

  // initialize the data array
  initData() {
    this.data = [];
    for (let i = 0; i < 10000; i++) {
      this.data.push({
        name: randomWords({ exactly: 3, join: " " }),
        description: randomWords({ exactly: 100, join: " " }),
        status: ["new", "submitted", "failed"][Math.floor(Math.random() * 3)],
      });
    }
  }

  //  subscribe to Observables for pagerbuttons, searchbox
  ngAfterViewInit() {
    // subscribe to searchbox input event
    this.subscriptions.add(
      fromEvent(this.query.nativeElement, "input").subscribe(
        (e: KeyboardEvent) => this.updateFilter(e)
      )
    );
    // subscribe to pager button 'next'
    this.subscriptions.add(
      fromEvent(this.buttonNext.nativeElement, "click").subscribe(
        (e: Event) => {
          e.preventDefault();
          this.page = this.page < this.lastPage ? ++this.page : this.lastPage;
          this.buttonNextDisabled = this.page === this.lastPage;
          this.buttonPrevDisabled = this.page === 1;
        }
      )
    );
    // subscribe to pager button 'previous'
    this.subscriptions.add(
      fromEvent(this.buttonPrev.nativeElement, "click").subscribe(
        (e: Event) => {
          e.preventDefault();
          this.page = this.page > 1 ? --this.page : 1;
          this.buttonNextDisabled = this.page === this.lastPage;
          this.buttonPrevDisabled = this.page === 1;
        }
      )
    );
  }

  // unsubscribe from subscriptions
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * filterFunction - return true if searchstring ('needle') is present in column ('haystack)
   * @param {string} haystack - the name, description or status where to search in
   * @param {string}  needle - the searchstring to filter on
   * @returns {boolean} - true if at least 1 needle is found in haystack
   */
  private filterFunction(haystack: string, needle: string): boolean {
    // convert string to array
    return (
      haystack
        .split(" ")
        // at least 1 word should match query
        .some((word: string) => word.indexOf(needle) === 0)
    );
  }

  populateFilteredData(filter) {
    filter = filter.trim();

    // if no input given show all
    if (!filter) {
      this.filteredData = this.data.slice();
      return;
    }

    // make an array of the space-separated string
    const _filter = filter.split(" ");
    // filter the data - all searchstrings should occur in at least 1 column
    this.filteredData = this.data.filter((entry) => {
      return (
        // search for query in 'name' column
        _filter.some((query: string) =>
          this.filterFunction(entry.name, query)
        ) ||
        // search for query in 'description' column
        _filter.some((query: string) =>
          this.filterFunction.call(entry.description, query)
        ) ||
        // search for query in 'status' column
        _filter.some((query: string) =>
          this.filterFunction.call(entry.status, query)
        )
      );
    });
    // update the number of pages
    this.lastPage = Math.ceil(this.filteredData.length / this.pageSize);
  }

  // called from subscription cb of input observable. Not really needed... leave it for clarity
  updateFilter($event: KeyboardEvent) {
    this.populateFilteredData(($event.target as HTMLInputElement).value);
  }
}
