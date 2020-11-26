export function getEnumVal(
  array: XingrenEmun,
  index: 0 | 1 | 2 | 'enName' | 'name' | 'value',
): string | number {
  if (!Array.isArray(array)) {
    return array;
  }
  const i = typeof index === 'number'
    ? index
    : ['enName', 'name', 'value'].indexOf(index);
  return array[i];
}

export function hasOwn(o: object, key: string) {
  return Object.prototype.hasOwnProperty.call(o, key);
}

export function download(blobParts: BlobPart, fileName = `${Date.now()}.xlsx`) {
  const blob = new Blob([blobParts], {
    type:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const elink = document.createElement('a');
  elink.download = fileName;
  elink.style.display = 'none';
  elink.href = window.URL.createObjectURL(blob);
  document.body.appendChild(elink);
  elink.click();
  window.URL.revokeObjectURL(elink.href);
  document.body.removeChild(elink);
}

export function serializedParams(params: Obj<string>): string {
  if (Object.prototype.toString.call(params) !== '[object Object]') {
    return '';
  }

  const parts = [];
  for (const key in params) {
    const val = params[key];
    if ([undefined, null].includes(val as unknown as null)) {
      parts.push(`${key}=`);
    } else {
      parts.push(`${key}=${val}`);
    }
  }

  return parts.length ? `?${parts.join('&')}` : '';
}
