export class File {
  constructor(
    public id: string,
    public name: string,
    public size: bigint,
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

  public static compare(fOne: File, fTwo: File) {
    if (fOne.fileName < fTwo.fileName) {
      return -1;
    } else if (fOne.fileName > fTwo.fileName) {
      return 1;
    }
    return 0;
  }
}
