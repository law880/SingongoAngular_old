export class Folder {
  public static FOLDER_TYPE = 'folder';
  public static FILE_TYPE = 'file';

  constructor(
    private id: string,
    private name: string,
    public contents: Map<string, string>, // id=key, type=value
    private parentId: string,
    private dateCreated: Date,
    private dateModified: Date
  ) { }

  get folderId() { return this.id; }

  get folderName() { return this.name; }

  get folderContents() { return this.contents; }

  get folderParentId() { return this.parentId; }

  get folderCreated() { return this.dateCreated; }

  get folderModified() { return this.dateModified; }
}
