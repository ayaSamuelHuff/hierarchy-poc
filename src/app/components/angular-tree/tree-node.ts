import { BehaviorSubject } from 'rxjs';
import { Account } from '../../model/account';

export class TreeNode {
  isLoading = false;
  isLoaded = false;
  hasChildren: boolean;


  children$: BehaviorSubject<TreeNode[]>;
  get children(): TreeNode[] {
    return this.children$.getValue();
  }
  change$ = new BehaviorSubject<'added' | 'removed' | null>(null);

  constructor(readonly account: Account) {
    this.children$ = new BehaviorSubject(account.children === undefined ? [] : account.children.map(x => new TreeNode(x)));
    this.hasChildren = account.hasChildren || (!!account.children && account.children.length > 0);
    this.isLoaded = (!!account.children && account.children.length > 0);
  }
}
