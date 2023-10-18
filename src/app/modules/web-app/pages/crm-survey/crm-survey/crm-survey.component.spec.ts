import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmSurveyComponent } from './crm-survey.component';

describe('CrmSurveyComponent', () => {
  let component: CrmSurveyComponent;
  let fixture: ComponentFixture<CrmSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
