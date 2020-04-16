import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOfferPage } from './add-offer.page';

describe('AddOfferPage', () => {
  let component: AddOfferPage;
  let fixture: ComponentFixture<AddOfferPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOfferPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOfferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
