
export type Nullable<T> = null | T;

export interface AccountFlatNode {
  expandable: boolean;
  data: {
    name: string;
    id: number;
  };
  level: number;
  isLoading: boolean;
  loaded?: boolean;
}
