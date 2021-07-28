import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTopbarComponent } from './table-topbar.component';

describe('TableTopbarComponent', () => {
  let component: TableTopbarComponent;
  let fixture: ComponentFixture<TableTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableTopbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
