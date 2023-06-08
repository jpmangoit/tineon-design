import { TestBed } from '@angular/core/testing';

import { MemberLightGuard } from './member-light.guard';

describe('MemberLightGuard', () => {
  let guard: MemberLightGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MemberLightGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
