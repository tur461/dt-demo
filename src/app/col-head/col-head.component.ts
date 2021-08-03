import { CdkFixedSizeVirtualScroll } from '@angular/cdk/scrolling';
import { Component, OnInit, ElementRef, ViewChild, Input, EventEmitter, Output, HostListener } from '@angular/core';
import $ from 'jquery';
import { ISortEvent, IHeading } from '../dtable/domain/airline.domain';

@Component({
  selector: 'app-col-head',
  templateUrl: './col-head.component.html',
  styleUrls: ['./col-head.component.css']
})
export class ColHeadComponent implements OnInit {
  @ViewChild('dd') dd: ElementRef=new ElementRef(null);
  @Input('col_num') col_num: number=0;

  @ViewChild('sortIcon') sortIcon: ElementRef=new ElementRef(null)
  
  @Output() sortEvent: EventEmitter<ISortEvent> = new EventEmitter();
  @Output() colCheckEvent: EventEmitter<any> = new EventEmitter();
  
  @Input('cols') cols: IHeading[]=[];

  cols_bkp: IHeading[]=[];

  showMenu: boolean = false;

  headings_checked: boolean[]=[];

  constructor() { }

  ngOnInit(): void {
    this.headings_checked = this.cols.map(c => c.show);
    this.cols_bkp = this.cols.map(c => c);
  }


  ngAfterViewInit() {
    this.sortIcon.nativeElement.id = `sort_${this.col_num}`;
  }

  @HostListener('document:click', ['$event'])
  clickout(e: any) {
    let xcls = [
      'main-menu-item',
      'column-menu--main',
      'column-check-list',
      'main-menu-item--span',
      'dtable--column_heading_menu',
      'column-check-list--searchcol',
      'column-conditional-filter--menu',
      'column-check-list--checkbox-item',
      'column-check-list--checkbox-label',
      'column-conditional-filter--menu-item',
      'col--checkbox column-check-list--checkbox',
    ];
    let isNotAnyMenuRelatedElement = (t:any) => {
      let res = !1;
      for(let i=0;i<xcls.length; ++i){ 
        res = 
        t?.classList.contains(xcls[i]) || 
        t.parentNode?.classList.contains(xcls[i]) ||
        t.parentNode.parentNode?.classList.contains(xcls[i])
        if(res) break;
      }
      return !res;
    }
    if(isNotAnyMenuRelatedElement(e.target)){
      console.log("clicked outside menu area");
      this.hideOtherMainMenus(-1);
    }
    else
      console.log("clicked inside menu area");
  }

  handleColumnSwitching(e:any){
    this.colCheckEvent.emit({f: e.target.id.split('__')[1], sh: e.target.checked});
  }

  
  handleColNameSearch(d:any){
    if(!d.v){
      this.cols = this.cols_bkp;
      return;
    }
    this.cols = this.cols.filter(c => c.header.toLocaleLowerCase().includes(d.v));
  }

  sort(e:any){
    let tc = e.target.previousSibling.textContent,
        cls = this.sortIcon.nativeElement.className,
        so = cls == 'sort_desc' ? 'sort_asc' : 'sort_desc',
        se: ISortEvent = {};
    this.sortIcon.nativeElement.className = so;
    se.col_name = tc.trim();
    se.sort_order = so;
    console.log('sort event');
    this.sortEvent.emit(se);
  }

  toggleMenu(e:any){
    let cn = e.target.id.split('_')[1],
        br = e.target.getBoundingClientRect(),
        cmi = document.getElementsByClassName( `main-menu-item_${cn}`),
        cccsm = document.getElementsByClassName(`column-check-submenu_${cn}`)[0],
        ccfsm = document.getElementsByClassName(`column-filter-submenu_${cn}`)[0];
        //console.log(document.getElementsByClassName( `main-menu-item_${cn}`));
    this.setupAttribsForMenuAndChildren(cn, br, cmi, cccsm, ccfsm);

  }
  private showMainMenu(n:number){
    document.querySelector(`.column-menu_${n}`)?.classList.toggle('show');
  }

  private hideOtherMainMenus(n:number){
    for(
      let i=0,
          shown=document.querySelectorAll(`.column-menu--main.show`),
          l=shown.length
          ; i<l
          ; !shown[i].className.includes('_'+n) &&  shown[i].classList.remove('show'), ++i
    );
  }

  setupAttribsForMenuAndChildren(cn:number, br:any, cmi:any, cccsm:any, ccfsm:any){
    let cm = document.getElementsByClassName(`column-menu_${cn}`)[0],
        cdm = cm.getBoundingClientRect(),
        cdccm = cccsm.getBoundingClientRect(),
        cdcfsm = ccfsm.getBoundingClientRect(),
        od = {l:br.left, r:br.right, t:br.top, b:br.bottom};
    this.showMainMenu(cn);
    this.hideOtherMainMenus(cn);
    
    if(cdm.width >= br.left) {// check if angle left or right
        //console.log(cmi);
        cmi.forEach((element: any) => {
          element.classList.contains('angle_on-after') &&
          element.classList.remove('angle_on-after');
          element.classList.contains('angle_on-before') ||
          element.classList.add('angle_on-before');
        });       
    }else{
        //console.log(cmi);
        cmi.forEach((element: any) => {
          element.classList.contains('angle_on-before') &&
          element.classList.remove('angle_on-before');
          element.classList.contains('angle_on-after') ||
          element.classList.add('angle_on-after');
        });
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
