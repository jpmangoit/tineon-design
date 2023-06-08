import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdashboardEventComponent } from './mdashboard-event.component';

describe('MdashboardEventComponent', () => {
  let component: MdashboardEventComponent;
  let fixture: ComponentFixture<MdashboardEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdashboardEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdashboardEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
