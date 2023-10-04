import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsurveyComponent } from './msurvey.component';

describe('MsurveyComponent', () => {
  let component: MsurveyComponent;
  let fixture: ComponentFixture<MsurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
