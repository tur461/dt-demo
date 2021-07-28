import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {
  
  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  
  @Input('rowsPerPage') rowCount: number;
  @Input('totalRecords') recordCount: number;
  pageSeries: number[];
  private pc: number = 0;
  private curPageNum: number= 1;
  constructor() { }

  ngOnInit(): void {
    this.pageSeries = [];
  }

  ngAfterViewInit() {
    
  }

  ngOnChanges() {
    this.pc = this.recordCount/this.rowCount;
    this.pageSeries = Array.from({length: this.pc >=3 ? 3 : this.pc},(v,k)=>k+1);
    console.log('pageSeries:', this.pageSeries, this.recordCount, this.rowCount);
  }

  pageNumberClick(e:any){
    let res: number = 1;
    if(e.target.parentNode.tagName !== 'P'){
      if(e.target.className === 'prev-page--icon')
        res = this.curPageNum - 1;
      res = this.curPageNum + 1;
    }
    else{
      res = +e.target.textContent;
    }
    if(this.curPageNum === res) return;
    this.curPageNum = res;
    this.pageChange.emit(this.curPageNum);
  }

}
