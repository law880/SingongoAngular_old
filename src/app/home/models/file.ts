export class File {
  constructor(
    public id: string,
    public name: string,
    public size: number,
    public dateCreated: Date,
    public dateModified: Date,
    public type: string,
    public extension: string
  ) { }

  get fileId() { return this.id; }

  get fileName() { return this.name; }

  get fileSize() { return this.size; }

  get fileCreated() { return this.dateCreated; }

  get fileModified() { return this.dateModified; }

  get fileType() { return this.type; }

  get fileExtension() { return this.extension; }

  get icon() {
    let iconName;
    if (this.type.includes('jpg') || this.type.includes('png') || this.type.includes('bmp')) {
      iconName = 'image';
    } else if (this.type.includes('pdf') || this.type.includes('word')) {
      iconName = 'doc';
    } else if (this.type.includes('mp4') || this.type.includes('mpeg')) {
      iconName = 'video';
    } else if (this.type.includes('mp3')) {
      iconName = 'audio';
    } else {
      iconName = 'unknown';
    }
    return 'assets/img/' + iconName + '.png';
  }

  public static compare(fOne: File, fTwo: File) {
    if (fOne.fileName < fTwo.fileName) {
      return -1;
    } else if (fOne.fileName > fTwo.fileName) {
      return 1;
    }
    return 0;
  }
}
