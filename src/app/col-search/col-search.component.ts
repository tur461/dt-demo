import { Component, Input, Output, OnInit, ElementRef, ViewChild, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-col-search',
  templateUrl: './col-search.component.html',
  styleUrls: ['./col-search.component.css']
})
export class ColSearchComponent implements OnInit {

  @Input('col_num') col_num: number=0;
  @Input('col_field') col_field: string='';

  @Output() searchEvent: EventEmitter<any> = new EventEmitter();
  
  @ViewChild('searchbox') searchbox: ElementRef = new ElementRef(null);
  constructor() { }

  @Input()
  height: any = '32px';

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.searchbox.nativeElement.id = `search_${this.col_num}`;
  }

  handleKeyup(e:any){
    this.searchEvent.emit({v: e.target.value.toLocaleLowerCase(), c_f:this.col_field});
  }

}

