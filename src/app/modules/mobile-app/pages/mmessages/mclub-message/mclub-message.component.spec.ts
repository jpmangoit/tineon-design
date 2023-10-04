import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MclubMessageComponent } from './mclub-message.component';

describe('MclubMessageComponent', () => {
  let component: MclubMessageComponent;
  let fixture: ComponentFixture<MclubMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MclubMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MclubMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
