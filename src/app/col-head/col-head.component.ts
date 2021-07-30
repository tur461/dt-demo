import { CdkFixedSizeVirtualScroll } from '@angular/cdk/scrolling';
import { Component, OnInit, ElementRef, ViewChild, Input, EventEmitter, Output } from '@angular/core';

import { ISortEvent, IHeading } from '../dtable/domain/airline.domain';

@Component({
  selector: 'app-col-head',
  templateUrl: './col-head.component.html',
  styleUrls: ['./col-head.component.css']
})
export class ColHeadComponent implements OnInit {
  @ViewChild('dd') dd: ElementRef;
  @Input('index') col_num: number;

  @ViewChild('sortIcon') sortIcon: ElementRef
  
  @Output() sortEvent: EventEmitter<ISortEvent> = new EventEmitter();
  @Output() colCheckEvent: EventEmitter<any> = new EventEmitter();
  
  @Input('cols') cols: IHeading[]=[];

  cols_bkp: IHeading[];

  showMenu: boolean = false;

  headings_checked: boolean[];

  constructor() { }

  ngOnInit(): void {
    this.headings_checked = this.cols.map(c => c.show);
    this.cols_bkp = this.cols.map(c => c);
  }



  ngAfterViewInit() {
    this.sortIcon.nativeElement.id = `sort_${this.col_num}`;
    this.setupListeners();    
  }

  setupListeners(){
    // col checkbox searchbox listener
    $(`input.search-check-column_${this.col_num}`).on('keyup', (e:any) => {
      let v = e.target.value.toLocaleLowerCase();
      if(!v){
        this.cols = this.cols_bkp;
        return;
      }
      this.cols = this.cols.filter(c => c.header.toLocaleLowerCase().includes(v));
    });
    // col show/hide checkbox listener
    $(`.column-check-submenu_${this.col_num} input.col--checkbox`).on('change', (e:any) => {
      this.colCheckEvent.emit({col_field: e.target.id.split('__')[1], show: e.target.checked});
    });
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

  toggleMenu(e:any){
    let cn = e.target.id.split('_')[1],
        br = e.target.getBoundingClientRect(),
        cmi = document.getElementsByClassName( `main-menu-item_${cn}`)[0],
        cccsm = document.getElementsByClassName(`column-check-submenu_${cn}`)[0],
        ccfsm = document.getElementsByClassName(`column-filter-submenu_${cn}`)[0];
    this.setupAttribsForMenuAndChildren(cn, br, cmi, cccsm, ccfsm);

  }

  setupAttribsForMenuAndChildren(cn:number, br:any, cmi:any, cccsm:any, ccfsm:any){
    let cm = document.getElementsByClassName(`column-menu_${cn}`)[0],
        cdm = cm.getBoundingClientRect(),
        cdccm = cccsm.getBoundingClientRect(),
        cdcfsm = ccfsm.getBoundingClientRect(),
        od = {l:br.left, r:br.right, t:br.top, b:br.bottom};
        cm.classList.toggle('show');
    console.log(`w: ${cdm.width}, l: ${br.left}`, cmi);
    if(cdm.width >= br.left) {// check if angle left or right
        console.log(cmi);
        cmi.classList.contains('angle_on-after') &&
        cmi.classList.remove('angle_on-after');
        cmi.classList.contains('angle_on-before') ||
        cmi.classList.add('angle_on-before');
    }else{
        console.log(cmi);
        cmi.classList.contains('angle_on-before') &&
        cmi.classList.remove('angle_on-before');
        cmi.classList.contains('angle_on-after') ||
        cmi.classList.add('angle_on-after');
    }

    // now position submenus correctly
      
    
    
    
  }

  showSubMenu(e:any){
    e.target.nextSibling.classList.toggle('show');
  }

  hideSubMenu(e:any){
    e.target.classList.contains('show') &&
    e.target.classList.remove('show');
  }
}
