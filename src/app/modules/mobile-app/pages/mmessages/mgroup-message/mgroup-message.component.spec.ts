import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MgroupMessageComponent } from './mgroup-message.component';

describe('MgroupMessageComponent', () => {
  let component: MgroupMessageComponent;
  let fixture: ComponentFixture<MgroupMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MgroupMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MgroupMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
