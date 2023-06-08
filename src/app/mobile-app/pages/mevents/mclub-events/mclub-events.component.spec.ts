import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MclubEventsComponent } from './mclub-events.component';

describe('MclubEventsComponent', () => {
  let component: MclubEventsComponent;
  let fixture: ComponentFixture<MclubEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MclubEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MclubEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
