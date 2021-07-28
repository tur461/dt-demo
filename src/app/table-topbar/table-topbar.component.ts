import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table-topbar',
  templateUrl: './table-topbar.component.html',
  styleUrls: ['./table-topbar.component.css']
})
export class TableTopbarComponent implements OnInit {

  @Output() export: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  exportEvent(w: string){
    this.export.emit(w);
  }

}
