import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteToolComponent } from './route-tool.component';

describe('RouteToolComponent', () => {
  let component: RouteToolComponent;
  let fixture: ComponentFixture<RouteToolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RouteToolComponent]
    });
    fixture = TestBed.createComponent(RouteToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
