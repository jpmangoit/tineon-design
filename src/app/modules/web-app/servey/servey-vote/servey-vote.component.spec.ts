import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServeyVoteComponent } from './servey-vote.component';

describe('ServeyVoteComponent', () => {
  let component: ServeyVoteComponent;
  let fixture: ComponentFixture<ServeyVoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServeyVoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServeyVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
