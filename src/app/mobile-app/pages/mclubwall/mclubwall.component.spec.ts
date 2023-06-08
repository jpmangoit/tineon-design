import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MclubwallComponent } from './mclubwall.component';

describe('MclubwallComponent', () => {
  let component: MclubwallComponent;
  let fixture: ComponentFixture<MclubwallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MclubwallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MclubwallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
