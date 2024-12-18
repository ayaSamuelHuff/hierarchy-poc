import { NestedTreeControl } from '@angular/cdk/tree';
import { isObservable, Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TreeNode } from './tree-node';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { CollectionViewer } from '@angular/cdk/collections';

export class LazyDataSource<
  T extends TreeNode = TreeNode
> extends MatTreeNestedDataSource<T> {
  private changeSub?: Subscription;

  constructor(
    private readonly treeControl: NestedTreeControl<T>,
    private readonly loadChildren: (node: T) => T[] | Observable<T[]>
  ) {
    super();
  }

  override connect(collectionViewer: CollectionViewer): Observable<T[]> {
    this.changeSub = this.treeControl.expansionModel.changed
      .pipe(map((selection) => selection.added.filter((n) => !n.isLoaded)))
      .subscribe((nodes) => {
        nodes.forEach((node) => {
          const children = this.loadChildren(node);

          if (isObservable(children)) {
            children.pipe(take(1)).subscribe((v) => node.children$.next(v));
          } else {
            node.children$.next(children ?? []);
          }
        });
      });

    return super.connect(collectionViewer);
  }

  override disconnect(): void {
      super.disconnect();

      this.changeSub?.unsubscribe();
  }
}
