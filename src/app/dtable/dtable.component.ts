import { Input, ViewChild, Component, OnInit, ElementRef } from '@angular/core';

import { AirlineService } from './services/airline.service';
import { IAirline_str, IAirline_arr, IHeading, ISortEvent, ICopy } from './domain/airline.domain';
import { Headings } from './constants/airline.constant';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-dtable',
  templateUrl: './dtable.component.html',
  styleUrls: ['./dtable.component.css']
})
export class DtableComponent implements OnInit {
  constructor(private airlineService: AirlineService) { }

  @ViewChild('dt') dt: ElementRef=new ElementRef(null);

  @Input('rowsPerPage') rows: number = 5;

  @Input() title: string = 'Organisation';

  private names: string[]=[];
  
  airlines = (<(IAirline_str & IAirline_arr)[]>[]);
  airlines_bkp = (<(IAirline_str & IAirline_arr)[]>[]);
  cur_slice = (<(IAirline_str & IAirline_arr)[]>[]);

  All_Headings: IHeading[] = this.clone(Headings);
  cols: IHeading[] = this.All_Headings.filter(h => h.show);
  column_checks_headings: IHeading[] = this.clone(Headings);

  xportOpt = {
    XL: 0,
    CSV: 1,
    csvDelim: ',',
    xl_extn: 'xlsx',
    csv_extn: 'csv',
    fileName: 'airline_organizations',
    getFilename: function(w:number) {
      let ret = `${this.fileName}_${new Date().getTime()}`;
      if(w == this.XL)
        return `${ret}.${this.XL}`;
      else if(w == this.CSV)
        return `${ret}.${this.CSV}`;
      throw new Error("unsupported functionality!");
    }
  };

  pagination = {
    total: 0,
    per_page: 0,    
    current_page: 0, 
    last_page: 0,
    from: 0,
    to: 0
   };

  loading: boolean = false;
  
  ngOnInit() {
    this.initDTable();
  }

  initDTable(){
    this.loading = !0;
    setTimeout(() => {
      this.airlineService.getAirlines().then(airlines => {
        let len = airlines.length; 
        this.rows = this.rows > len ? len : this.rows;
        this.airlines_bkp = airlines;
        this.airlines = airlines.slice(0, this.rows);
        this.cur_slice = <(IAirline_str & IAirline_arr)[]> this.clone(this.airlines);
        this.initPagination();
      });
      this.loading = !1;
      
    }, 10 );
  }
  
  handlePerColumnSearch(d:any){
    if(!d.v) this.airlines = this.cur_slice;
    this.airlines = this.airlines.filter(
      airline => {
        let c = airline[d.c_f];
        if(this.isArray(c))
          return c.find(cc => cc.toLocaleLowerCase().includes(d.v));
        return `${c}`.toLocaleLowerCase().includes(d.v);
      });
  }

  sortByColumn(e: ISortEvent){
    let key = this.cols.filter(c => c.header.trim() == e.col_name)[0].field,
        mul = e.sort_order == 'sort_desc' ? -1 : 1;
    console.log(key, mul);
    this.airlines = this.airlines.sort((a, b) => {
      return `${a[key]}`.localeCompare(`${b[key]}`) * mul;
    })
  }

  handleColCheck(e: any){
    console.log('column checkbox event: '+e.f, e.sh);
    this.All_Headings[this.All_Headings.findIndex(h => h.field===e.f)].show = e.sh;    
    this.cols = this.All_Headings.filter(h => h.show);
    for(let el:HTMLInputElement, i=0, l=this.cols.length; i<l; ++i) {
      el = document.getElementById(`col--check__${e.f}__${i}`) as HTMLInputElement;
      el && (el.checked = e.sh); // hidden element would be null
    }
  }

  selectPage(pageNumber: number){
    console.log('page # selected:', pageNumber);
    // ensure in-range
    pageNumber = pageNumber < 1 ? 1 : pageNumber > this.pagination.total ? this.pagination.total : pageNumber;
    this.pagination.current_page = pageNumber;
    this.pagination.from = this.from();
    this.pagination.to = this.to();
    console.log(`pageNum: ${pageNumber} start: ${this.pagination.from} end: ${this.pagination.to}`);
    this.airlines = this.airlines_bkp.slice(this.pagination.from, this.pagination.to);
    this.cur_slice = <(IAirline_str & IAirline_arr)[]> this.clone(this.airlines);
  }

  changePageSize(size: number){
    console.log(`page size change event: ${size}`);
    this.rows = size;
    this.initDTable();
  }

  handleExport(w: string){
    console.log('export event:', w);
    w == 'excel' ? this.exportExcel() : this.exportCSV();
  }

  private exportExcel() {
    let workbook = new Workbook(),
        worksheet = workbook.addWorksheet(this.xportOpt.fileName);
    worksheet.columns = this.cols.map(c => {
      return {header: c.header, key: c.field};
    });
    this.airlines.forEach(a => {
      let aa: IAirline_arr = {};
      this.cols.forEach(c => aa[c.field] = a[c.field])
      worksheet.addRow(aa);
    });
    workbook.xlsx.writeBuffer().then((buf: BlobPart) => {
      let blob = new Blob([buf], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      fs.saveAs(blob, this.xportOpt.getFilename(this.xportOpt.XL));
    });
  }

  private exportCSV() {
    const workbook = new Workbook(),
          worksheet = workbook.addWorksheet(this.xportOpt.fileName);
    worksheet.columns = this.cols.map(c => {
      return {header: c.header, key: c.field};
    });
    this.airlines.forEach(a => {
      let aa: IAirline_arr = {};
      this.cols.forEach(c => aa[c.field] = a[c.field])
      worksheet.addRow(aa);
    });
    workbook.csv.writeBuffer({ formatterOptions: { delimiter: this.xportOpt.csvDelim } })
    .then((buf: BlobPart) => {
      let blob = new Blob([buf], { 
        type: 'application/octet-stream'
      });
      fs.saveAs(blob, this.xportOpt.getFilename(this.xportOpt.CSV));
    })
    .catch();   
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
    let c: ICopy;
    if (null == obj || "object" != typeof obj) return obj;
    if (obj instanceof Date) {
        c = new Date();
        c.setTime(obj.getTime());
        return c;
    }
    if (obj instanceof Array) {
        c = [];
        for (let i=0, l=obj.length; i < l; ++i) c[i] = this.clone(obj[i]);
        return c;
    }
    if (obj instanceof Object) {
        c = {};
        for (let k in obj) if (obj.hasOwnProperty(k)) c[k] = this.clone(obj[k]);
        return c;
    }
    throw new Error("Unable to c obj! Its type isn't supported.");
  }
}
