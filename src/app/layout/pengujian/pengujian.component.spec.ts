import { async, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { PengujianComponent } from './pengujian.component'
import { PengujianModule } from './pengujian.module'

describe('PengujianComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ PengujianModule, RouterTestingModule ],
    })
    .compileComponents()
  }))

  it('should create', () => {
    const fixture = TestBed.createComponent(PengujianComponent)
    const component = fixture.componentInstance
    expect(component).toBeTruthy()
  })
})
