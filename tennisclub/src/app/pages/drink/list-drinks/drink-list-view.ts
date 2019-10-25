export class DrinkListView {
  public id: string;
  public creator: string;
  public time: string;
  public cost: string;

  constructor(id: string, creator: string, time: string, cost: string) {
    this.id = id;
    this.creator = creator;
    this.time = time;
    this.cost = cost;
  }
}
