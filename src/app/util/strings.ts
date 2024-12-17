type CompareOpts = {
  ignoreCase: boolean;
};

export const compare = (a: string, b: string, opts: CompareOpts = {
  ignoreCase: false
}) => {
  if(opts.ignoreCase) {
    a = a.toLowerCase();
    b = b.toLowerCase();
  }

  return a === b;
}

export const includes = (a: string, b: string, opts: CompareOpts = {
  ignoreCase: false
}) => {
  if(opts.ignoreCase) {
    a = a.toLowerCase();
    b = b.toLowerCase();
  }

  return a.includes(b);
}
