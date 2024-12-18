export type RootAccount = Named & {
  id: number;
  children: RootAccount[],
  hasChildren: boolean;
};

export type Account = Named & {
  parentId?: number;
  id: number;
  facilities?: Named[];
  services?: Named[];
  children?: Account[];
  hasChildren: boolean;
};

export type Named = {
  name: string;
};

export type Node = {
  name: string;
  hasChildren: boolean;

  // May, or may not, be populated on load.
  children?: Node[];

  // May, or may not, be populated on load.
  facilities?: Named[];
  services?: Named[];
}
