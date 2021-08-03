import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';

import * as $ from 'jquery';

@Component({
  selector: 'app-super-user',
  templateUrl: './super-user.component.html',
  styleUrls: ['./super-user.component.css']
})
export class SuperUserComponent implements OnInit {
  @ViewChild('abrv') abrv: ElementRef=new ElementRef(null);
  @ViewChild('name') name: ElementRef=new ElementRef(null);
  @ViewChild('count') count: ElementRef=new ElementRef(null);

  @Input('abrv') _abrv: string='';
  @Input('name') _name: string='';
  @Input('count') _count: string='';

  @Input('names') names: string[] = [];
  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges() {
    this.names = this.names.length > 1 ? this.names.slice(1) : [];
  }

  ngAfterViewInit() {
    
    this.abrv.nativeElement.textContent = this._abrv;
    this.name.nativeElement.textContent = this._name;
    this.count.nativeElement.textContent = this._count;
    // console.log(this.names);
  }

  getAbrv(s: string){
    return s.split(/\s/).map(ss => ss[0].toLocaleUpperCase()).join('');
  }

}
