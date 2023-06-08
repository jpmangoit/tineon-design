import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeventDetailComponent } from './mevent-detail.component';

describe('MeventDetailComponent', () => {
  let component: MeventDetailComponent;
  let fixture: ComponentFixture<MeventDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeventDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeventDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
