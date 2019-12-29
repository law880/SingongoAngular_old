export class File {
  constructor(
    private id: string,
    private name: string,
    private size: bigint,
    private dateCreated: Date,
    private dateModified: Date,
    private type: string,
    private extension: string
  ) { }

  get fileId() { return this.id; }

  get fileName() { return this.name; }

  get fileSize() { return this.size; }

  get fileCreated() { return this.dateCreated; }

  get fileModified() { return this.dateModified; }

  get fileType() { return this.type; }

  get fileExtension() { return this.extension; }
}
