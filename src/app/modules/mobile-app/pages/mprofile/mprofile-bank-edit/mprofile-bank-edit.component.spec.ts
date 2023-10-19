import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MprofileBankEditComponent } from './mprofile-bank-edit.component';

describe('MprofileBankEditComponent', () => {
  let component: MprofileBankEditComponent;
  let fixture: ComponentFixture<MprofileBankEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MprofileBankEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MprofileBankEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
