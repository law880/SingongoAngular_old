import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameViewComponent } from './rename-view.component';

describe('FolderRenameComponent', () => {
  let component: RenameViewComponent;
  let fixture: ComponentFixture<RenameViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
