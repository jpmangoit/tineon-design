import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MprofileEditComponent } from './mprofile-edit.component';

describe('MprofileEditComponent', () => {
  let component: MprofileEditComponent;
  let fixture: ComponentFixture<MprofileEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MprofileEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MprofileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
