import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferRequestPage } from './offer-request.page';

describe('OfferRequestPage', () => {
  let component: OfferRequestPage;
  let fixture: ComponentFixture<OfferRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferRequestPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
