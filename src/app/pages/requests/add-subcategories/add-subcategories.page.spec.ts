import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubcategoriesPage } from './add-subcategories.page';

describe('AddSubcategoriesPage', () => {
  let component: AddSubcategoriesPage;
  let fixture: ComponentFixture<AddSubcategoriesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSubcategoriesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubcategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
