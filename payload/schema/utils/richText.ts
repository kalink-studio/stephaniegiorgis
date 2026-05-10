const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isEmptyLexicalRoot = (value: unknown) => {
  if (!isObject(value)) {
    return false;
  }

  const root = value.root;

  return (
    isObject(root) &&
    root.type === 'root' &&
    Array.isArray(root.children) &&
    root.children.length === 0
  );
};

export const normalizeEmptyRichText = <T>(value: T): T | null => {
  if (isEmptyLexicalRoot(value)) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeEmptyRichText(item)) as T;
  }

  if (!isObject(value)) {
    return value;
  }

  let didChange = false;
  const normalized: Record<string, unknown> = {};

  for (const [key, childValue] of Object.entries(value)) {
    const nextValue = normalizeEmptyRichText(childValue);
    normalized[key] = nextValue;

    if (nextValue !== childValue) {
      didChange = true;
    }
  }

  return (didChange ? normalized : value) as T;
};
