import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCalendarComponent } from './upload-calendar.component';

describe('UploadCalendarComponent', () => {
  let component: UploadCalendarComponent;
  let fixture: ComponentFixture<UploadCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
