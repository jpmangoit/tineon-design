import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McrmSurveyComponent } from './mcrm-survey.component';

describe('McrmSurveyComponent', () => {
  let component: McrmSurveyComponent;
  let fixture: ComponentFixture<McrmSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McrmSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McrmSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
