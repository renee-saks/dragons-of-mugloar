import { API_URL } from '../constants';

export function buildEndpointUrl(apiRoute: string, gameId: string) {
  const isGameIdExpected = apiRoute.includes(':gameId');
  const isGameIdProvided = gameId !== '';

  if (isGameIdExpected && isGameIdProvided) {
    return `${API_URL}/${apiRoute}`.replace(/:gameId/g, gameId);
  }

  if (isGameIdExpected && !isGameIdProvided) {
    throw new Error(`Route '${apiRoute}' expected gameId but got empty string`);
  }

  return `${API_URL}/${apiRoute}`;
}

export function decodeBase64(str: string) {
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(str)) {
    console.warn(`Invalid Base64: "${str}", returning as-is`);
    return str;
  }

  const text = atob(str);
  const length = text.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    bytes[i] = text.charCodeAt(i);
  }

  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

export function decryptRot13(str: string) {
  return str.replace(/[a-zA-Z]/g, (char) => {
    const charCode = char.charCodeAt(0);
    const isUpperCase = char <= 'Z';
    const maxCode = isUpperCase ? 90 : 122;
    const rotatedCode = charCode + 13;

    return String.fromCharCode(
      rotatedCode <= maxCode ? rotatedCode : rotatedCode - 26,
    );
  });
}

export function includesAny(targetString: string, searchStrings: string[]) {
  return searchStrings.some((searchString) =>
    targetString.toLowerCase().includes(searchString.toLowerCase()),
  );
}
