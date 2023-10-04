import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McommunityGroupsComponent } from './mcommunity-groups.component';

describe('McommunityGroupsComponent', () => {
  let component: McommunityGroupsComponent;
  let fixture: ComponentFixture<McommunityGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McommunityGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McommunityGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
