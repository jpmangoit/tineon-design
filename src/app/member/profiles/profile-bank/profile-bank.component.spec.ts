import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileBankComponent } from './profile-bank.component';

describe('ProfileBankComponent', () => {
  let component: ProfileBankComponent;
  let fixture: ComponentFixture<ProfileBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileBankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
