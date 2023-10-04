import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MmySurveyComponent } from './mmy-survey.component';

describe('MmySurveyComponent', () => {
  let component: MmySurveyComponent;
  let fixture: ComponentFixture<MmySurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MmySurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MmySurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
