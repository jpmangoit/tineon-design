import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MprofileClubComponent } from './mprofile-club.component';

describe('MprofileClubComponent', () => {
  let component: MprofileClubComponent;
  let fixture: ComponentFixture<MprofileClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MprofileClubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MprofileClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
