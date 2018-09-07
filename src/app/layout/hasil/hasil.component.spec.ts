import { async, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { HasilComponent } from './hasil.component'
import { HasilModule } from './hasil.module'

describe('HasilComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HasilModule, RouterTestingModule ],
    })
    .compileComponents()
  }))

  it('should create', () => {
    const fixture = TestBed.createComponent(HasilComponent)
    const component = fixture.componentInstance
    expect(component).toBeTruthy()
  })
})
