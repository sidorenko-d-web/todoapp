import { camelCase, snakeCase } from 'change-case';

type CaseType = 'camel' | 'snake';

const caseTransformers: Record<CaseType, (input: string) => string> = {
  camel: camelCase,
  snake: snakeCase,
};

export const caseTransform = (data: any, caseType: CaseType): any => {
  const caseConverter = caseTransformers[caseType];

  if (!data) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => caseTransform(item, caseType));
  }

  if (typeof data === 'object') {
    return Object.keys(data).reduce((acc: any, key: string) => {
      const transformedKey = caseConverter(key);
      acc[transformedKey] = caseTransform(data[key], caseType);
      return acc;
    }, {});
  }

  return data;
};
