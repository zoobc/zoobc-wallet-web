import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatDetailComponent } from './seat-detail.component';

describe('SeatDetailComponent', () => {
  let component: SeatDetailComponent;
  let fixture: ComponentFixture<SeatDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
