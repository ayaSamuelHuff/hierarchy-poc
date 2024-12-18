import {
  NestedTreeControl,
} from '@angular/cdk/tree';
import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  Observable,
  of,
  share,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AccountTreeService } from '../../data/account.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Nullable } from './interfaces';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TreeNode } from './tree-node';
import {
  LazyDataSource,
} from './lazy-nested-tree-node.component';

@Component({
  selector: 'app-angular-tree',
  standalone: true,
  imports: [
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    AsyncPipe,
    NgFor,
    MatListModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    NgIf,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './angular-tree.component.html',
  styleUrl: './angular-tree.component.scss',
})
export class AngularTreeComponent implements OnInit {
  private readonly accountService = new AccountTreeService();
  private readonly snackbar = inject(MatSnackBar);

  searchControl = new FormControl<string>('');

  accountTreeControl: NestedTreeControl<TreeNode>;
  dataSource: LazyDataSource;

  constructor() {
    this.accountTreeControl = new NestedTreeControl<TreeNode>((n) => n.children$.asObservable());
    this.dataSource = new LazyDataSource(this.accountTreeControl, this.loadChildren);
  }

  selectedAccountId$ = new Subject<Nullable<number>>();

  activeAccountId$ = this.selectedAccountId$.pipe(
    distinctUntilChanged(),
    share()
  );

  selectedAccountData$ = this.selectedAccountId$.pipe(
    distinctUntilChanged(),
    filter((x) => !!x),
    map((x) => x as number),
    switchMap((id) =>
      forkJoin([
        this.accountService.getFacilities(id),
        this.accountService.getServices(id),
      ])
    ),
    share()
  );

  facilities$ = this.selectedAccountData$.pipe(map(([f, _]) => f));

  services$ = this.selectedAccountData$.pipe(map(([_, s]) => s));

  hasChild = (_: number, node: TreeNode) => node.hasChildren;

  loadChildren = (n: TreeNode): Observable<TreeNode[]> => {
    n.isLoading = true;

    return this.accountService.getChildAccounts(n.account.id).pipe(
      map((x) => x.flatMap((x) => new TreeNode(x))),
      tap(() => (n.isLoading = false))
    );
  };

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(300),
        switchMap((st) => {
          if (st === null || st === '') {
            return of([]);
          }

          return this.accountService.searchAccounts(st);
        })
      )
      .subscribe((a) => {
        this.dataSource.data = a.flatMap((x) => new TreeNode(x));

        for (const n of this.getExpandedNodes(this.dataSource.data)) {
          this.accountTreeControl.expand(n);
        }
      });
  }

  getExpandedNodes(nodes: TreeNode[]): TreeNode[] {
    const v: TreeNode[] = [];

    for (const node of nodes) {
      if (!node.account.children?.length) {
        continue;
      }

      v.push(node);

      v.push(...this.getExpandedNodes(node.children));
    }

    return v;
  }

  selectAccount(node: TreeNode) {
    this.selectedAccountId$.next(node.account.id);
  }

  showNavigate(name: string) {
    this.snackbar.open(`Open ${name} in new tab`, 'Dismiss', {
      duration: 2000,
    });
  }

  navigateService(name: string) {
    this.showNavigate(`service "${name}"`);
  }

  navigateFacility(name: string) {
    this.showNavigate(`facility "${name}"`);
  }

  navigateAccount(event: MouseEvent, name: string) {
    event.stopPropagation();
    event.preventDefault();

    this.showNavigate(`account "${name}"`);
  }

  trackByIdFn(index: number, node: TreeNode) {
    return node.account.id;
  }
}
