import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MprofileMyClubComponent } from './mprofile-my-club.component';

describe('MprofileMyClubComponent', () => {
  let component: MprofileMyClubComponent;
  let fixture: ComponentFixture<MprofileMyClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MprofileMyClubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MprofileMyClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
