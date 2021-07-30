import { OnChanges, AfterViewInit, Input, ViewChild, Component, OnInit, Renderer2 as Renderer, ElementRef, Output } from '@angular/core';

import { AirlineService } from './services/airline.service';
import { IAirline_str, IAirline_arr, IHeading, ISortEvent, ICopy } from './domain/airline.domain';
import { Headings } from './constants/airline.constant';
import * as $ from 'jquery';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-dtable',
  templateUrl: './dtable.component.html',
  styleUrls: ['./dtable.component.css']
})
export class DtableComponent implements OnInit {
  constructor(private airlineService: AirlineService) { }
  
  @ViewChild('dt') dt: ElementRef;

  @Input('rowsPerPage') rows: number;

  private names: string[];
  
  title = "Organizations";
  xl_extn = "xlsx";

  airlines = (<(IAirline_str & IAirline_arr)[]>[]);
  airlines_bkp = (<(IAirline_str & IAirline_arr)[]>[]);
  cur_slice = (<(IAirline_str & IAirline_arr)[]>[]);

  cols: IHeading[] = Headings.filter(h => h.show);
  headings_checked: boolean[] = Headings.map(_ => !0);
  column_checks_headings: IHeading[] = Headings;

  pagination = {
    total: 0,
    per_page: 0,    
    current_page: 0, 
    last_page: 0,
    from: 0,
    to: 0
   };

  loading: boolean;
  

  ngOnInit() {
    this.loading = !0;
    setTimeout(() => {
      this.airlineService.getAirlines().then(airlines => { 
        this.rows = this.rows + 1;
        this.airlines_bkp = airlines;
        this.airlines = airlines.slice(0, this.rows);
        this.cur_slice = <(IAirline_str & IAirline_arr)[]> this.clone(this.airlines);
        this.initPagination();
      });
      this.loading = !1;
      
    }, 1000);
  }

  ngAfterViewInit() {
    this.setupPerColumnSearching();
  }

  setupPerColumnSearching(){
    // column search feature implemented here
    $('input.table--filter-col_searchbox').on('keyup', (e: any) => {
      if(!e.target.value){
        this.airlines = this.cur_slice;
      }

      let colname = $(`.dtable--column_heading:nth-child(${e.target.id.split('_')[1]}) .dtable--column_heading_text`).html();

      let val = e.target.value.toLocaleLowerCase();
      this.airlines = this.airlines.filter(
        a => {
          let b = this.cols.filter(c => c.header === colname)[0].field, c = a[b];
          if(this.isArray(c))
            return c.find(cc => cc.toLocaleLowerCase().includes(val));
          return `${c}`.toLocaleLowerCase().includes(val);
        });
    });
  }

  sortByColumn(e: ISortEvent){
    console.log('sort event:', e);
    let key = this.cols.filter(c => c.header == e.col_name)[0].field,
        mul = e.sort_order == 'sort_desc' ? -1 : 1;
    console.log(key, mul);
    this.airlines = this.airlines.sort((a, b) => {
      return `${a[key]}`.localeCompare(`${b[key]}`) * mul;
    })
  }

  handleColCheck(e: any){
    console.log('colCheckEvent:', e, 'cols:', this.cols);
  
    this.cols = this.cols.map(col => {
      if(col.field === e.col_field)
        return { ...col, show: e.show};
      return col;
    });
    setTimeout(_ => {
      console.log('after 5 sec, cols:', this.cols);
    }, 5000);
  }

  selectPage(pageNumber:number){
    console.log('page # selected:', pageNumber);
    // ensure in-range
    pageNumber = pageNumber < 1 ? 
    1 : pageNumber > this.pagination.total ? this.pagination.total : pageNumber;
    
    this.pagination.current_page = pageNumber;
    this.pagination.from = this.from();
    this.pagination.to = this.to();
    console.log(`pageNum: ${pageNumber} start: ${this.pagination.from} end: ${this.pagination.to}`);
    this.airlines = this.airlines_bkp.slice(this.pagination.from, this.pagination.to);
    this.cur_slice = <(IAirline_str & IAirline_arr)[]> this.clone(this.airlines);
  }

  handleExport(w: string){
    console.log('export event:', w);
    w == 'excel' ? this.exportExcel() : this.exportCSV();
  }

  private exportExcel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(this.title);
    worksheet.columns = this.cols.map(c => {
      return {header: c.header, key: c.field};
    });
    this.airlines.forEach(a => {
      let aa: IAirline_arr & IAirline_arr = {};
      this.cols.forEach(c => aa[c.field] = a[c.field])
      worksheet.addRow(aa);
    });
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      fs.saveAs(blob, `${this.title}.${this.xl_extn}`);
    });
  }

  private exportCSV() {
 
    let workbook = new Workbook();
   
  }

  private lastPage(){
    return Math.ceil(this.pagination.total / this.pagination.per_page);
  }

  private from(){
    return ((this.pagination.current_page - 1) * this.pagination.per_page);
  }

  private to(){
    return (this.pagination.current_page  * this.pagination.per_page) - 1;
  }

  private initPagination(){
    this.pagination.total = this.airlines_bkp.length;
    this.pagination.per_page = this.rows;
    this.pagination.current_page = 1;
    this.pagination.last_page = this.lastPage();
    this.pagination.from = this.from();
    this.pagination.to = this.to();
  }

  isArray(val: any){
    if(Array.isArray(val)){
      this.names = val
      return !0;
    }
    return !1;
  }

  getAbrv(){
    return this.names.length ? this.names[0].split(/\s/).map(s => s[0].toLocaleUpperCase()).join('') : '';
  }

  getName(){
    return this.names.length ? this.names[0] : '';
  }

  getCount(){
    return this.names.length > 1 ? `+${this.names.length - 1}` : '';
  }
  
  clone(obj:any) {
    var copy: ICopy;

    if (null == obj || "object" != typeof obj) return obj;

    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = this.clone(obj[i]);
        }
        return copy;
    }

    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

}
