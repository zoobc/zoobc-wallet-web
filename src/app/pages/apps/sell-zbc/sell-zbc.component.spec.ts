import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellZbcComponent } from './sell-zbc.component';

describe('SellZbcComponent', () => {
  let component: SellZbcComponent;
  let fixture: ComponentFixture<SellZbcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SellZbcComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellZbcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
