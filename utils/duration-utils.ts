type N = number | 'CURRENT';
export type Unit = 'DAY' | 'MONTH' | 'YEAR'

export function getDurationParams (duration: string = '6M') {
  let n: N;
  let unit: Unit;
  const matched = duration.match(/^(\d+)([YMD])$/);
  if (!matched) {
    unit = 'YEAR';
    if (duration === 'YTD') {
      n = 'CURRENT';
    } else if (duration === 'MAX') {
      n = 150;
    } else {
      n = 1;
    }
  } else {
    const [, nValue, unitValue] = matched;
    n = parseInt(nValue);
    switch (unitValue) {
      case 'Y':
        unit = 'YEAR';
        break;
      case 'D':
        unit = 'DAY';
        break;
      case 'M':
        unit = 'MONTH';
        break;
      default:
        unit = 'DAY';
        break;
    }
  }

  return { n, unit };
}