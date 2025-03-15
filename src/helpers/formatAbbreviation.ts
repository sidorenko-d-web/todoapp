type AbbreviationType = 'number' | 'currency' | 'percent' | 'date';

type ScaleConfig = {
  threshold: number;
  suffixRu: string;
  suffixEn: string;
};

type FormatAbbreviationOptions = {
  locale?: 'ru' | 'en';
  decimals?: number;
  currencySymbol?: string;
};

const scales: ScaleConfig[] = [
  { threshold: 1e12, suffixRu: 'трлн.', suffixEn: 'T' },
  { threshold: 1e9, suffixRu: 'млрд.', suffixEn: 'B' },
  { threshold: 1e6, suffixRu: 'млн.', suffixEn: 'M' },
];

export const formatAbbreviation = (
  value: number | string | Date | undefined | null,
  abbreviationType: AbbreviationType = 'number',
  { locale = 'ru', decimals = 2, currencySymbol = ' $USDT' }: FormatAbbreviationOptions = {},
): string => {
  if (value === undefined || value === null) {
    return ''; // Возвращаем пустую строку или значение по умолчанию
  }

  if (abbreviationType === 'date') {
    const asDate = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;
    if (Number.isNaN(asDate.getTime())) return '';
    const dd = String(asDate.getDate()).padStart(2, '0');
    const mm = String(asDate.getMonth() + 1).padStart(2, '0');
    const yy = String(asDate.getFullYear()).slice(-2).padStart(2, '0');
    return `${dd}.${mm}.${yy}`;
  }

  const numericValue =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? parseFloat(value.replace(/\s+/g, '').replace(',', '.'))
        : value instanceof Date
          ? value.getTime()
          : NaN;

  if (Number.isNaN(numericValue)) return String(value);

  const separator = locale === 'ru' ? ' ' : ',';
  const decimalMark = locale === 'ru' ? ',' : '.';

  const formatInt = (num: number) => {
    const parts = Math.floor(num).toString().split('');
    let out = '';
    for (let i = parts.length - 1, c = 1; i >= 0; i--, c++) {
      out = parts[i] + out;
      if (c % 3 === 0 && i !== 0) out = separator + out;
    }
    return out;
  };

  const formatFrac = (num: number) => {
    if (decimals < 1) return '';

    const fractionRaw = Math.abs(num - Math.floor(num))
      .toFixed(decimals)
      .split('.')[1];

    if (!fractionRaw) return '';

    let fractionTrimmed = fractionRaw.replace(/0+$/, '');

    if (fractionTrimmed.length === 1 && decimals >= 2) {
      fractionTrimmed += '0';
    }

    return fractionTrimmed ? decimalMark + fractionTrimmed : '';
  };

  if (abbreviationType === 'currency') {
    const intPart = formatInt(numericValue);
    const fracPart = formatFrac(numericValue);
    const s = intPart + fracPart;
    return locale === 'ru' ? `${s} ${currencySymbol}` : `${s.replace(/\s/g, '')}${currencySymbol}`;
  }

  if (abbreviationType === 'percent') {
    const intPart = formatInt(numericValue);
    const fracPart = formatFrac(numericValue);
    const s = intPart + fracPart;
    return locale === 'ru' ? `${s} %` : `${s}%`;
  }

  if (abbreviationType === 'number') {
    const absVal = Math.abs(numericValue);
    const scaleItem = scales.find(item => absVal >= item.threshold);

    if (!scaleItem) {
      const intPart = formatInt(numericValue);
      const fracPart = formatFrac(numericValue);
      return intPart + fracPart;
    }

    const base = numericValue / scaleItem.threshold;
    const whole = Math.floor(base);
    let fracRaw = (base - whole).toFixed(decimals).split('.')[1] ?? '';
    fracRaw = fracRaw.replace(/0+$/, '');

    if (fracRaw.length === 1 && decimals >= 2) {
      fracRaw += '0';
    }

    const suffix = locale === 'ru' ? scaleItem.suffixRu : scaleItem.suffixEn;
    const formattedWhole = formatInt(whole);

    if (scaleItem.threshold === 1e12) {
      const truncatedValue = Math.floor(numericValue / 1e12);
      const truncatedString = truncatedValue.toString().slice(0, 4);
      return locale === 'ru' ? `${truncatedString}... ${suffix}` : `${truncatedString}...${suffix}`;
    }

    if (!fracRaw) {
      return locale === 'ru' ? `${formattedWhole} ${suffix}` : `${formattedWhole}${suffix}`;
    }

    return locale === 'ru'
      ? `${formattedWhole}${decimalMark}${fracRaw} ${suffix}`
      : `${formattedWhole}${decimalMark}${fracRaw}${suffix}`;
  }

  const intPart = formatInt(numericValue);
  const fracPart = formatFrac(numericValue);
  return intPart + fracPart;
};
