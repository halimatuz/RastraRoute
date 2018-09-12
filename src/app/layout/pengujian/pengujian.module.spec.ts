import { PengujianModule } from './pengujian.module';

describe('PengujianModule', () => {
  let pengujianModule: PengujianModule;

  beforeEach(() => {
    pengujianModule = new PengujianModule();
  });

  it('should create an instance', () => {
    expect(pengujianModule).toBeTruthy();
  });
});
