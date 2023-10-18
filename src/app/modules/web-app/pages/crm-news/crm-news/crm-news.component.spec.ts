import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmNewsComponent } from './crm-news.component';

describe('CrmNewsComponent', () => {
  let component: CrmNewsComponent;
  let fixture: ComponentFixture<CrmNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrmNewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
