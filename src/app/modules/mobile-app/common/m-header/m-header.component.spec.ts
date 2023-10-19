import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MHeaderComponent } from './m-header.component';

describe('MHeaderComponent', () => {
  let component: MHeaderComponent;
  let fixture: ComponentFixture<MHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
