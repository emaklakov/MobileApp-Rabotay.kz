import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletPage } from './complet.page';

describe('CompletPage', () => {
  let component: CompletPage;
  let fixture: ComponentFixture<CompletPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
