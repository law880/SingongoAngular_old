import { Folder } from './folder';

describe('Folder', () => {
  it('should create an instance', () => {
    expect(new Folder('', '', new Map<string, string>(), '', new Date(), new Date(), 0)).toBeTruthy();
  });
});
