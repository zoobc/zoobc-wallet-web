import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeSelectorComponent } from './fee-selector.component';

describe('FeeSelectorComponent', () => {
  let component: FeeSelectorComponent;
  let fixture: ComponentFixture<FeeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
