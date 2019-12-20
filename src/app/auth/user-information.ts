export class UserInformation {
  public static ADMIN_ROLE = true;
  public static USER_ROLE = false;

  constructor(
    private id: string,
    private username: string,
    private password: string,
    private name: string,
    private authLevel: boolean,
  ) {
  }

  get userId() {
    return this.id;
  }

  get userUsername() {
    return this.username;
  }

  get userPassword() {
    return this.password;
  }

  get userName() {
    return this.name;
  }

  get userAuthLevel() {
    return this.authLevel;
  }

  setId(id: string) {
    this.id = id;
  }

  setUsername(username: string) {
    this.username = username;
  }

  setPassword(password: string) {
    this.password = password;
  }

  setName(name: string) {
    this.name = name;
  }

  setAuthLevel(authLevel: boolean) {
    this.authLevel = authLevel;
  }
}
