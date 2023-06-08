import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorganizerEventsComponent } from './morganizer-events.component';

describe('MorganizerEventsComponent', () => {
  let component: MorganizerEventsComponent;
  let fixture: ComponentFixture<MorganizerEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MorganizerEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MorganizerEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
