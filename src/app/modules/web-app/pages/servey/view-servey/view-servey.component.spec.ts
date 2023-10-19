import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewServeyComponent } from './view-servey.component';

describe('ViewServeyComponent', () => {
  let component: ViewServeyComponent;
  let fixture: ComponentFixture<ViewServeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewServeyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewServeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
