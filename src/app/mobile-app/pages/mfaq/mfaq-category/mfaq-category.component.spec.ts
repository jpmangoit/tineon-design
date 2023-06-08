import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfaqCategoryComponent } from './mfaq-category.component';

describe('MfaqCategoryComponent', () => {
  let component: MfaqCategoryComponent;
  let fixture: ComponentFixture<MfaqCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MfaqCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MfaqCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
