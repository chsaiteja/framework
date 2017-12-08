export class ReflectionModel {

  UserNotes: string;
  UpdatedTimeStamp: string;
  Today: string;

  constructor() {
    this.UpdatedTimeStamp = "";
    this.UserNotes = "";
    this.Today = "";
  }
}

export class ReflectionPostModel {

  UserNotes: string;
  UpdatedTimeStamp: Date;
  Today: Date;

  constructor() {
    this.UpdatedTimeStamp = new Date;
    this.UserNotes = "";
    this.Today = new Date;
  }
}