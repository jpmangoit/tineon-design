import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MactiveSurveyComponent } from './mactive-survey.component';

describe('MactiveSurveyComponent', () => {
  let component: MactiveSurveyComponent;
  let fixture: ComponentFixture<MactiveSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MactiveSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MactiveSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
