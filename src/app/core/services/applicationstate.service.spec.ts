import { TestBed } from '@angular/core/testing';

import { ApplicationstateService } from './applicationstate.service';

describe('ApplicationstateService', () => {
  let service: ApplicationstateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationstateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
