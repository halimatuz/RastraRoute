import { PengaturanModule } from './pengaturan.module';

describe('PengaturanModule', () => {
  let pengaturanModule: PengaturanModule;

  beforeEach(() => {
    pengaturanModule = new PengaturanModule();
  });

  it('should create an instance', () => {
    expect(pengaturanModule).toBeTruthy();
  });
});
