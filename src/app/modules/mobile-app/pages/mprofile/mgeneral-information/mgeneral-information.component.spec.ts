import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MgeneralInformationComponent } from './mgeneral-information.component';

describe('MgeneralInformationComponent', () => {
  let component: MgeneralInformationComponent;
  let fixture: ComponentFixture<MgeneralInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MgeneralInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MgeneralInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
