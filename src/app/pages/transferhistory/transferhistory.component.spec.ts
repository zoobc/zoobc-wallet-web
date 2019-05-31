import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferhistoryComponent } from './transferhistory.component';

describe('TransferhistoryComponent', () => {
  let component: TransferhistoryComponent;
  let fixture: ComponentFixture<TransferhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
