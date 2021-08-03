import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import $ from 'jquery';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {
  
  @Output() pageChange: EventEmitter<number> = new EventEmitter();

  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter();
  
  @Input('rowsPerPage') rowCount: number=0;
  @Input('totalRecords') recordCount: number=0;
  pageSeries: number[]=[];
  private totalPages = 0;
  private curPageNum = 1;
  private pagesShownUntilNow = 0;
  constructor() { }

  ngOnInit(): void {
    this.pageSeries = [];
  }

  ngAfterViewInit() {}

  ngOnChanges() {
    this.paginationFunc();
  }

  paginationFunc(){
    // calculate pages
    this.totalPages = Math.ceil(this.recordCount/this.rowCount);
    this.pageSeries = Array.from({length: this.totalPages >=3 ? 3 : this.totalPages},(v,k)=>k+1);
    // set text into caption
    let c = 0;
    this.recordCount &&
    (c = this.recordCount>this.rowCount?this.rowCount:this.recordCount);
    this.pagesShownUntilNow = c;
    this.setSpanTexts();
    // console.log('pageSeries:', this.pageSeries, this.recordCount, this.rowCount, c);
  }

  private setSpanTexts(){
    $('#shownRecordCountText').text(this.pagesShownUntilNow);
    $('#totalRecordCountText').text(this.recordCount);
  }

  private renewPageNumStrip(asc: boolean){
    console.log('asc:',asc);
    let pageNumSpans = document.querySelectorAll('span.pageSelection');

    if(asc)
      for(let i=0,l=pageNumSpans.length; i<l; pageNumSpans[i].textContent=(this.curPageNum+i)+'', ++i);
    else
      for(let i=0, j=pageNumSpans.length-1; j>=0; pageNumSpans[j].textContent= `${this.curPageNum-i}`, ++i, --j);
  }

  private setActive(){
    let pageNumSpans = document.querySelectorAll('span.pageSelection');
    for(let i=0,l=pageNumSpans.length; i<l;++i){
      if(pageNumSpans[i].textContent === this.curPageNum+''){
        pageNumSpans[i].classList.contains('active') ||
        pageNumSpans[i].classList.add('active');
      }else{
        pageNumSpans[i].classList.contains('active') &&
        pageNumSpans[i].classList.remove('active');
      }
    }
  }

  
  private calcPagesShown(){
    let c = this.rowCount * this.curPageNum;
    c = c > this.recordCount ? this.recordCount : c;
    this.pagesShownUntilNow = c;
  }

  pageNumberClick(e:any){
    let res: number = 1, asc=!0;
    if(e.target.parentNode.tagName !== 'P')
      if(e.target.className.indexOf('prev') !== -1 && !(asc=!1))
        res = this.curPageNum - 1;
      else
        res = this.curPageNum + 1;
    else
      res = +e.target.textContent;
    if(this.curPageNum === res || res < 1 || res > this.totalPages) return;
    this.curPageNum = res;
    (
      !((this.curPageNum-1) % 3) && asc ||
      !(this.curPageNum % 3) && !asc
    )
    && this.renewPageNumStrip(asc);
    this.setActive();
    this.calcPagesShown();
    this.setSpanTexts();
    this.pageChange.emit(this.curPageNum);
  }

  handlePageSizeChange(e:any){
    this.pageSizeChange.emit(+e.target.value);
  }

}
