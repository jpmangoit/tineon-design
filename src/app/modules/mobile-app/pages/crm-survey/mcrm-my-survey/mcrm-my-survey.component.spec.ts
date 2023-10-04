import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McrmMySurveyComponent } from './mcrm-my-survey.component';

describe('McrmMySurveyComponent', () => {
  let component: McrmMySurveyComponent;
  let fixture: ComponentFixture<McrmMySurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McrmMySurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McrmMySurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
