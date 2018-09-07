import { HasilModule } from './hasil.module';

describe('HasilModule', () => {
  let hasilModule: HasilModule;

  beforeEach(() => {
    hasilModule = new HasilModule();
  });

  it('should create an instance', () => {
    expect(hasilModule).toBeTruthy();
  });
});
