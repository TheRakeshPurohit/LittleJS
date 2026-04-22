import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isNumber, isString, isArray, isVector2, isColor, vec2, rgb, Vector2, Color } from '../dist/littlejs.esm.js';

test('isNumber', () =>
{
    assert.equal(isNumber(0), true);
    assert.equal(isNumber(-1.5), true);
    assert.equal(isNumber(Infinity), true);
    assert.equal(isNumber(NaN), false);
    assert.equal(isNumber('1'), false);
    assert.equal(isNumber(null), false);
    assert.equal(isNumber(undefined), false);
    assert.equal(isNumber({}), false);
});

test('isString', () =>
{
    assert.equal(isString(''), true);
    assert.equal(isString('abc'), true);
    assert.equal(isString(42), true);
    assert.equal(isString(null), false);
    assert.equal(isString(undefined), false);
});

test('isArray', () =>
{
    assert.equal(isArray([]), true);
    assert.equal(isArray([1, 2, 3]), true);
    assert.equal(isArray({}), false);
    assert.equal(isArray('abc'), false);
    assert.equal(isArray(null), false);
});

test('isVector2', () =>
{
    assert.equal(isVector2(vec2()), true);
    assert.equal(isVector2(new Vector2(1, 2)), true);
    assert.equal(isVector2({ x: 1, y: 2 }), false);
    assert.equal(isVector2(null), false);
    assert.equal(isVector2(undefined), false);
    assert.equal(isVector2([1, 2]), false);
});

test('isColor', () =>
{
    assert.equal(isColor(rgb()), true);
    assert.equal(isColor(new Color(1, 0, 0)), true);
    assert.equal(isColor({ r: 1, g: 1, b: 1, a: 1 }), false);
    assert.equal(isColor(null), false);
    assert.equal(isColor(undefined), false);
});
