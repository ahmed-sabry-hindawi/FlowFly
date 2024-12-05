import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDirectoryComponent } from './users-directory.component';

describe('UsersDirectoryComponent', () => {
  let component: UsersDirectoryComponent;
  let fixture: ComponentFixture<UsersDirectoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersDirectoryComponent]
    });
    fixture = TestBed.createComponent(UsersDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
