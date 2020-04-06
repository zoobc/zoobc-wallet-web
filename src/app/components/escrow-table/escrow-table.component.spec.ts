import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscrowTableComponent } from './escrow-table.component';

describe('EscrowTableComponent', () => {
  let component: EscrowTableComponent;
  let fixture: ComponentFixture<EscrowTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscrowTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscrowTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
