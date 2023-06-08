import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McrmCompletedSurveyComponent } from './mcrm-completed-survey.component';

describe('McrmCompletedSurveyComponent', () => {
  let component: McrmCompletedSurveyComponent;
  let fixture: ComponentFixture<McrmCompletedSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McrmCompletedSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McrmCompletedSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
