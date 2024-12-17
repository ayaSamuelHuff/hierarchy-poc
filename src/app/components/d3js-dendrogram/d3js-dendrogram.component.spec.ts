import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3jsDendrogramComponent } from './d3js-dendrogram.component';

describe('D3jsDendrogramComponent', () => {
  let component: D3jsDendrogramComponent;
  let fixture: ComponentFixture<D3jsDendrogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [D3jsDendrogramComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(D3jsDendrogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
