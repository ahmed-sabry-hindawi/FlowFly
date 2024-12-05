import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountActivationComponent } from './user-account-activation.component';

describe('UserAccountActivationComponent', () => {
  let component: UserAccountActivationComponent;
  let fixture: ComponentFixture<UserAccountActivationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserAccountActivationComponent]
    });
    fixture = TestBed.createComponent(UserAccountActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
