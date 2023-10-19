import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmSurveyViewComponent } from './crm-survey-view.component';

describe('CrmSurveyViewComponent', () => {
  let component: CrmSurveyViewComponent;
  let fixture: ComponentFixture<CrmSurveyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmSurveyViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmSurveyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
