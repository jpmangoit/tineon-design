import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateServeyComponent } from './update-servey.component';

describe('UpdateServeyComponent', () => {
  let component: UpdateServeyComponent;
  let fixture: ComponentFixture<UpdateServeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateServeyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateServeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
