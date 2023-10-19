import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileBankEditComponent } from './profile-bank-edit.component';

describe('ProfileBankEditComponent', () => {
  let component: ProfileBankEditComponent;
  let fixture: ComponentFixture<ProfileBankEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileBankEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileBankEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
