import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorganizerDocumentsComponent } from './morganizer-documents.component';

describe('MorganizerDocumentsComponent', () => {
  let component: MorganizerDocumentsComponent;
  let fixture: ComponentFixture<MorganizerDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MorganizerDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MorganizerDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
