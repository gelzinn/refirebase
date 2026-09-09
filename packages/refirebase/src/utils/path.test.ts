import { describe, expect, test } from 'bun:test';
import { collectionSegments, docSegments, splitPath } from './path';

describe('splitPath', () => {
  test('splits slash-delimited paths', () => {
    expect(splitPath('users')).toEqual(['users']);
    expect(splitPath('conversations/abc/messages')).toEqual([
      'conversations',
      'abc',
      'messages',
    ]);
  });

  test('strips empty segments', () => {
    expect(splitPath('/users/')).toEqual(['users']);
  });

  test('rejects empty paths', () => {
    expect(() => splitPath('')).toThrow();
    expect(() => splitPath('///')).toThrow();
  });
});

describe('collectionSegments', () => {
  test('accepts odd-length paths', () => {
    expect(collectionSegments('messages')).toEqual(['messages']);
    expect(collectionSegments('conversations/abc/messages')).toEqual([
      'conversations',
      'abc',
      'messages',
    ]);
  });

  test('rejects document paths', () => {
    expect(() => collectionSegments('conversations/abc')).toThrow(
      /odd number of segments/,
    );
  });
});

describe('docSegments', () => {
  test('appends the document id', () => {
    expect(docSegments('messages', 'm1')).toEqual(['messages', 'm1']);
    expect(docSegments('conversations/abc/messages', 'm1')).toEqual([
      'conversations',
      'abc',
      'messages',
      'm1',
    ]);
  });

  test('rejects slash in document id', () => {
    expect(() => docSegments('messages', 'a/b')).toThrow(/slashes/);
  });
});
