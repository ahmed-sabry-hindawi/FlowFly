import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowflyComponent } from './flowfly.component';

describe('FlowflyComponent', () => {
  let component: FlowflyComponent;
  let fixture: ComponentFixture<FlowflyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlowflyComponent]
    });
    fixture = TestBed.createComponent(FlowflyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
