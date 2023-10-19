import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McommunityComponent } from './mcommunity.component';

describe('McommunityComponent', () => {
  let component: McommunityComponent;
  let fixture: ComponentFixture<McommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McommunityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
