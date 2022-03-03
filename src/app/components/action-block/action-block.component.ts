import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
  selector: 'action-block',
  templateUrl: './action-block.component.html',
  styleUrls: ['./action-block.component.scss']
})
export class ActionBlockComponent implements OnInit, AfterViewInit {

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  @Output() onAdd = new EventEmitter<void>();
  @Output() onSearch = new EventEmitter<string>();
  @Output() onRefresh = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(

      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      // , filter(res => res.length > 2)

      // Time in milliseconds between key events
      , debounceTime(300)

      // If previous query is different from current
      , distinctUntilChanged()

      // subscription for response
    ).subscribe((text: string) => {
      this.onSearch.emit(text);
    });
  }

  onAddClicked($event: Event): void {
    this.onAdd.emit();
  }

  onRefreshClicked($event: Event): void {
    this.onRefresh.emit();
  }
}
