import { EMPTY, Observable } from 'rxjs';
import { Nullable } from '../components/angular-tree/interfaces';
import { Account, Named } from '../model/account';
import { accounts } from './account-tree.data';
import { fakeNetwork } from '../util/fake-network';

export class AccountTreeService {
  searchAccounts(searchTerm: string): Observable<Account[]> {
    var a: (Account & {
      hasChildren?: boolean;
    })[] = [];

    for (const account of accounts) {
      if (
        account.children?.some((x) =>
          x.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        a.push(account);
      } else if (
        account.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        a.push({
          ...account,
          children: [],
          hasChildren: !!account.children?.length,
        });
      }
    }

    return fakeNetwork(
      a.map((x) => ({
        id: x.id,
        name: x.name,
        children: x.children,
        hasChildren: x.hasChildren ||  (!!x.children && x.children.length > 0),
      }))
    );
  }

  getAccounts(): Observable<Account[]> {
    console.log('GET /account-tree/accounts');

    return fakeNetwork(
      accounts.map((x) => {
        return {
          id: x.id,
          name: x.name,
          children: [],
          hasChildren: x.children == null ? false : x.children.length > 0,
        };
      })
    );
  }

  getChildAccounts(accountId: number): Observable<Account[]> {
    console.log(`GET /account-tree/accounts/${accountId}/children`);
    return fakeNetwork(findAccount(accountId)?.children ?? []);
  }

  getFacilities(
    accountId: number
  ): Observable<{ name: string; values: Named[] }[]> {
    console.log(`GET /account-tree/accounts/${accountId}/facilities`);
    const account = findAccount(accountId);

    if (!account) {
      return EMPTY;
    }

    var r = this.getAll(account, (a) => a.facilities ?? []);

    return fakeNetwork(r);
  }

  private getAll(
    account: Account,
    fn: (account: Account) => Named[]
  ): {
    name: string;
    values: Named[];
  }[] {
    return [
      {
        name: account.name,
        values: fn(account),
      },
      ...(account.children?.flatMap((c) => this.getAll(c, fn)) ?? []),
    ];
  }

  getServices(accountId: number): Observable<Named[]> {
    console.log(`GET /account-tree/accounts/${accountId}/services`);
    const account = findAccount(accountId);

    return fakeNetwork(account?.services ?? []);
  }
}

const satisfiesSearch = (a: Account, fn: (a: Account) => boolean): boolean => {
  if (fn(a)) {
    return true;
  }

  for (const c of a.children ?? []) {
    if (satisfiesSearch(c, fn)) {
      return true;
    }
  }

  return false;
};

const findAccount = (
  id: number,
  list: Account[] = accounts
): Nullable<Account> => {
  if (!list) {
    return null;
  }

  for (const a of list) {
    if (a.id === id) {
      return a;
    }

    if (a.children) {
      const n = findAccount(id, a.children);

      if (n) {
        return n;
      }
    }
  }

  return null;
};

type NamedResult = {
  owner: string;
  values: Named[];
};
