import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardTableComponent } from './reward-table.component';

describe('RewardTableComponent', () => {
  let component: RewardTableComponent;
  let fixture: ComponentFixture<RewardTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RewardTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
