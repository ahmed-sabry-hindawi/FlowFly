import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavNarrowComponent } from './side-nav-narrow.component';

describe('SideNavNarrowComponent', () => {
  let component: SideNavNarrowComponent;
  let fixture: ComponentFixture<SideNavNarrowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideNavNarrowComponent]
    });
    fixture = TestBed.createComponent(SideNavNarrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
