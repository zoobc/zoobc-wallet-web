import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeRewardListComponent } from './node-reward-list.component';

describe('NodeRewardListComponent', () => {
  let component: NodeRewardListComponent;
  let fixture: ComponentFixture<NodeRewardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeRewardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeRewardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
