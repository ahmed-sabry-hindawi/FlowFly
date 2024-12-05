import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyRequestComponent } from './apply-request.component';

describe('ApplyRequestComponent', () => {
  let component: ApplyRequestComponent;
  let fixture: ComponentFixture<ApplyRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplyRequestComponent]
    });
    fixture = TestBed.createComponent(ApplyRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
