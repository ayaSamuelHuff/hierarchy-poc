import { CollectionViewer, DataSource, SelectionChange } from "@angular/cdk/collections";
import { AccountFlatNode } from "./interfaces";
import { BehaviorSubject, firstValueFrom, map, merge, Observable } from "rxjs";
import { FlatTreeControl } from "@angular/cdk/tree";
import { AccountTreeService } from "../../data/account.service";
import { Account } from "../../model/account";

export const flatten = (account: Account, level: number = 0): AccountFlatNode[] => {

  return [
    {
      data: {
        name: account.name,
        id: account.id,
      },
      level,
      expandable: account.children.length > 0 || account.hasChildren,
      isLoading: false,
    },
    ...account.children.flatMap(x => flatten(x, level + 1)),
  ];
}

export class AccountsDataSource implements DataSource<AccountFlatNode> {
  dataChange = new BehaviorSubject<AccountFlatNode[]>([]);

  get data(): AccountFlatNode[] {
    return this.dataChange.value;
  }

  set data(value: AccountFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private readonly _treeControl: FlatTreeControl<AccountFlatNode>,
    private readonly _database: AccountTreeService
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<AccountFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe((change) => {
      if (change.added || change.removed) {
        this.handleTreeControl(change);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(
      map(() => this.data)
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {}

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<AccountFlatNode>): void {
    if (change.added) {
      change.added.forEach((node) => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach((node) => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  async toggleNode(node: AccountFlatNode, expand: boolean): Promise<void> {
    const index = this.data.findIndex(x => x.data.id === node.data.id);
    if (index < 0) {
      // If no children, or cannot find the node, no op
      return;
    }

    node.isLoading = true;

    setTimeout(async () => {
      if (expand) {
        const children = await firstValueFrom(this._database.getChildAccounts(node.data.id));

        const nodes = children.map((data) => {
          return {
            data: {
              name: data.name,
              id: data.id,
            },
            level: node.level + 1,
            expandable: !!data.children && data.children.length > 0,
          } as AccountFlatNode;
        });
        this.data.splice(index + 1, 0, ...nodes);
      } else {
        let count = 0;
        for (
          let i = index + 1;
          i < this.data.length && this.data[i].level > node.level;
          i++, count++
        ) {}
        this.data.splice(index + 1, count);
      }

      this.dataChange.next(this.data);
      node.isLoading = false;
    }, expand ? 250 : 1);
  }
}
