import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, inject, OnInit } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  of,
  share,
  Subject,
  switchMap,
} from 'rxjs';
import { AsyncPipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AccountTreeService } from '../../data/account.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AccountFlatNode, Nullable } from './interfaces';
import { AccountsDataSource, flatten } from './accounts-data-source';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    NgTemplateOutlet,
  ],
  templateUrl: './angular-tree.component.html',
  styleUrl: './angular-tree.component.scss',
})
export class AngularTreeComponent implements OnInit {
  private readonly accountService = new AccountTreeService();
  private readonly snackbar = inject(MatSnackBar);

  facilityDataSource$ = new Subject<any>();

  searchControl = new FormControl<string>('');

  accountTreeControl: FlatTreeControl<AccountFlatNode>;
  dataSource: AccountsDataSource;

  constructor() {
    this.accountTreeControl = new FlatTreeControl<AccountFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new AccountsDataSource(
      this.accountTreeControl,
      this.accountService
    );
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

  loadFacilities$ = new Subject<number>();

  facilities$ = this.selectedAccountData$.pipe(map(([f, _]) => f));

  services$ = this.selectedAccountData$.pipe(map(([_, s]) => s));

  hasChild = (_: number, node: AccountFlatNode) => node.expandable;
  getLevel = (node: AccountFlatNode) => node.level;
  isExpandable = (node: AccountFlatNode) => node.expandable;

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
        this.dataSource.data = a.flatMap((x) => flatten(x));
      });
  }

  selectAccount(node: AccountFlatNode) {
    this.selectedAccountId$.next(node.data.id);
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

  trackByIdFn(index: number, node: AccountFlatNode) {
    return node.data.id;
  }
}
