import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IACDetailComponent } from './iac-detail.component';

describe('IACDetailComponent', () => {
  let component: IACDetailComponent;
  let fixture: ComponentFixture<IACDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IACDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IACDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
