export class DrinkListView {
  public id: string;
  public creator: string;
  public time: string;
  public cost: string;
  public isSummaryList: boolean;

  constructor(id: string, creator: string, time: string, cost: string, isSummaryList: boolean) {
    this.id = id;
    this.creator = creator;
    this.time = time;
    this.cost = cost;
    this.isSummaryList = isSummaryList;
  }
}
