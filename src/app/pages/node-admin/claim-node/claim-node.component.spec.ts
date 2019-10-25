import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimNodeComponent } from './claim-node.component';

describe('ClaimNodeComponent', () => {
  let component: ClaimNodeComponent;
  let fixture: ComponentFixture<ClaimNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
