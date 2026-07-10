const fnParser = (exp) => {
  if (!exp) {
    return []
  }
  let [fnName, ...arg] = exp.replace(/@/, '').split(/[~]+/);
  let fnDef = (window as any).funMap?.[fnName];
  return [fnDef, arg];
}

export { fnParser }