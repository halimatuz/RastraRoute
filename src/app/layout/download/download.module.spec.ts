import { DownloadModule } from './download.module';

describe('DaownloadModule', () => {
  let downloadModule: DownloadModule;

  beforeEach(() => {
    downloadModule = new DownloadModule();
  });

  it('should create an instance', () => {
    expect(downloadModule).toBeTruthy();
  });
});
