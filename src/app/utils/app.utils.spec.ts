import { API_URL } from '../constants';
import {
  buildEndpointUrl,
  decodeBase64,
  decryptRot13,
  includesAny,
} from './app.utils';

describe('buildEndpointUrl', () => {
  it('should replace :gameId in the route when gameId is provided', () => {
    const apiRoute = ':gameId/messages';
    const gameId = '12345';

    const result = buildEndpointUrl(apiRoute, gameId);

    expect(result).toBe(`${API_URL}/12345/messages`);
  });

  it('should throw an error when :gameId is in the route but gameId is empty', () => {
    const apiRoute = ':gameId/messages';
    const gameId = '';

    expect(() => buildEndpointUrl(apiRoute, gameId)).toThrowError();
  });

  it('should return the route unchanged when :gameId is not in the route', () => {
    const apiRoute = 'game/start';
    const gameId = '12345';
    const result = buildEndpointUrl(apiRoute, gameId);

    expect(result).toBe(`${API_URL}/${apiRoute}`);
  });
});

describe('decodeBase64', () => {
  it('should decode a valid Base64 string', () => {
    const base64String = 'SGVsbG8sIFdvcmxkIQ==';
    const result = decodeBase64(base64String);

    expect(result).toBe('Hello, World!');
  });

  it('should return the input string if it is not valid Base64', () => {
    const invalidBase64 = 'Invalid@@Base64';
    const result = decodeBase64(invalidBase64);

    expect(result).toBe(invalidBase64);
  });

  it('should handle an empty string gracefully', () => {
    const result = decodeBase64('');

    expect(result).toBe('');
  });
});

describe('decryptRot13', () => {
  it('should decrypt a ROT13-encoded string', () => {
    const encoded = 'Uryyb, Jbeyq!';
    const result = decryptRot13(encoded);

    expect(result).toBe('Hello, World!');
  });

  it('should leave non-alphabetic characters unchanged', () => {
    const input = '1234!@#$';
    const result = decryptRot13(input);

    expect(result).toBe('1234!@#$');
  });
});

describe('includesAny', () => {
  it('should return true if any search string is found in the target string', () => {
    const targetString = 'The quick brown fox jumps over the lazy dog';
    const searchStrings = ['fox', 'cat'];

    const result = includesAny(targetString, searchStrings);

    expect(result).toBe(true);
  });

  it('should return false if none of the search strings are found in the target string', () => {
    const targetString = 'The quick brown fox jumps over the lazy dog';
    const searchStrings = ['cat', 'mouse'];

    const result = includesAny(targetString, searchStrings);

    expect(result).toBe(false);
  });

  it('should handle an empty search array gracefully', () => {
    const targetString = 'The quick brown fox jumps over the lazy dog';
    const searchStrings: string[] = [];

    const result = includesAny(targetString, searchStrings);

    expect(result).toBe(false);
  });

  it('should be case-insensitive when searching', () => {
    const targetString = 'The quick brown fox jumps over the lazy dog';
    const searchStrings = ['FOX', 'DOG'];

    const result = includesAny(targetString, searchStrings);

    expect(result).toBe(true);
  });
});
