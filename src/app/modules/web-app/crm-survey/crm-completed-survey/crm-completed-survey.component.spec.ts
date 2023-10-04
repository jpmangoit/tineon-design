import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmCompletedSurveyComponent } from './crm-completed-survey.component';

describe('CrmCompletedSurveyComponent', () => {
  let component: CrmCompletedSurveyComponent;
  let fixture: ComponentFixture<CrmCompletedSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmCompletedSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmCompletedSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
