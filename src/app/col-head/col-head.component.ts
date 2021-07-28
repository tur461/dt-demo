import { Component, OnInit, ElementRef, ViewChild, Input, EventEmitter, Output } from '@angular/core';

import { ISortEvent, IHeading } from '../dtable/domain/airline.domain';

@Component({
  selector: 'app-col-head',
  templateUrl: './col-head.component.html',
  styleUrls: ['./col-head.component.css']
})
export class ColHeadComponent implements OnInit {
  @ViewChild('dd') dd: ElementRef;
  @Input('index') index: number;

  @ViewChild('sortIcon') sortIcon: ElementRef
  
  @Output() sortEvent: EventEmitter<ISortEvent> = new EventEmitter();
  
  @Input('cols') cols: IHeading[]=[];

  showMenu: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }


  ngAfterViewInit() {
    this.sortIcon.nativeElement.id = `sort_${this.index}`;
    
  }

  sort(e:any){
    let tc = e.target.previousSibling.textContent,
        cls = this.sortIcon.nativeElement.className,
        so = cls == 'sort_desc' ? 'sort_asc' : 'sort_desc',
        se: ISortEvent = {};
    this.sortIcon.nativeElement.className = so;
    se.col_name = tc;
    se.sort_order = so;
    this.sortEvent.emit(se);
  }

  show_dd(){
    // this.dd.nativeElement.classList.toggle('show');
  }

}
