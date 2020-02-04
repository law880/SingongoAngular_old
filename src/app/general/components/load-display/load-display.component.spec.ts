import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDisplayComponent } from './load-display.component';

describe('LoadDisplayComponent', () => {
  let component: LoadDisplayComponent;
  let fixture: ComponentFixture<LoadDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
