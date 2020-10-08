import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormClaimNodeComponent } from './form-claim-node.component';

describe('FormClaimNodeComponent', () => {
  let component: FormClaimNodeComponent;
  let fixture: ComponentFixture<FormClaimNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormClaimNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormClaimNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
