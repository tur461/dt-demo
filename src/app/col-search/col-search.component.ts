import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-col-search',
  templateUrl: './col-search.component.html',
  styleUrls: ['./col-search.component.css']
})
export class ColSearchComponent implements OnInit {

  @Input('index') index: number;

  @ViewChild('searchbox') searchbox: ElementRef
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.searchbox.nativeElement.id = `search_${this.index}`;
  }

}
