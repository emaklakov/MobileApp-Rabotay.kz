import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEmptyPage } from './page-empty.page';

describe('PageEmptyPage', () => {
  let component: PageEmptyPage;
  let fixture: ComponentFixture<PageEmptyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageEmptyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageEmptyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
