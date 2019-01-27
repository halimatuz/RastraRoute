import { async, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { DownloadComponent } from './download.component'
import { DownloadModule } from './download.module'

describe('DownloadComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ DownloadModule, RouterTestingModule ],
    })
    .compileComponents()
  }))

  it('should create', () => {
    const fixture = TestBed.createComponent(DownloadComponent)
    const component = fixture.componentInstance
    expect(component).toBeTruthy()
  })
})
