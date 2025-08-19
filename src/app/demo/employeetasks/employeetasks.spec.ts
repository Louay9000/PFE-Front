import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Employeetasks } from './employeetasks';

describe('Employeetasks', () => {
  let component: Employeetasks;
  let fixture: ComponentFixture<Employeetasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Employeetasks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Employeetasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
