import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Okrs } from './okrs';

describe('Okrs', () => {
  let component: Okrs;
  let fixture: ComponentFixture<Okrs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Okrs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Okrs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
