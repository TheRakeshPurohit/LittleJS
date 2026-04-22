import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    PI, clamp, percent, lerp, mod, smoothStep, nearestPowerOfTwo,
    distanceWrap, lerpWrap, distanceAngle, lerpAngle,
    isOverlapping, isIntersecting,
    vec2, Vector2, rgb, hsl, Color,
    RandomGenerator,
    rand, randInt,
} from '../dist/littlejs.esm.js';

// small tolerance for floating point comparisons
const EPS = 1e-9;
const near = (a, b, eps=EPS) => Math.abs(a - b) < eps;

test('clamp', () =>
{
    assert.equal(clamp(0.5), 0.5);
    assert.equal(clamp(-1), 0);
    assert.equal(clamp(2), 1);
    assert.equal(clamp(5, 0, 10), 5);
    assert.equal(clamp(-5, 0, 10), 0);
    assert.equal(clamp(15, 0, 10), 10);
});

test('percent', () =>
{
    assert.equal(percent(5, 0, 10), 0.5);
    assert.equal(percent(0, 0, 10), 0);
    assert.equal(percent(10, 0, 10), 1);
    assert.equal(percent(-5, 0, 10), 0); // clamped
    assert.equal(percent(15, 0, 10), 1); // clamped
    assert.equal(percent(5, 5, 5), 0);   // division by zero guard
});

test('lerp', () =>
{
    assert.equal(lerp(0, 10, 0), 0);
    assert.equal(lerp(0, 10, 1), 10);
    assert.equal(lerp(0, 10, 0.5), 5);
    assert.equal(lerp(0, 10, -1), 0);    // percent clamped
    assert.equal(lerp(0, 10, 2), 10);    // percent clamped
});

test('mod', () =>
{
    assert.equal(mod(5, 3), 2);
    assert.equal(mod(-1, 3), 2);        // negative handled
    assert.equal(mod(-4, 3), 2);
    assert.equal(mod(0, 3), 0);
    assert.equal(mod(0.5), 0.5);         // default divisor = 1
});

test('smoothStep', () =>
{
    assert.equal(smoothStep(0), 0);
    assert.equal(smoothStep(1), 1);
    assert.equal(smoothStep(0.5), 0.5);
    assert(smoothStep(0.25) < 0.25);     // slower start
    assert(smoothStep(0.75) > 0.75);     // faster end (relative to linear)
});

test('nearestPowerOfTwo', () =>
{
    assert.equal(nearestPowerOfTwo(1), 1);
    assert.equal(nearestPowerOfTwo(3), 4);
    assert.equal(nearestPowerOfTwo(100), 128);
    assert.equal(nearestPowerOfTwo(16), 16);
});

test('distanceWrap / lerpWrap', () =>
{
    assert(near(distanceWrap(0.1, 0.9), 0.2));    // shortest path wraps forward
    assert(near(distanceWrap(0.9, 0.1), -0.2));
    assert(near(distanceWrap(0, 0), 0));
    // lerpWrap returns the un-wrapped interpolated value: 0.9 + 0.5*0.2 = 1.0
    // (1.0 is equivalent to 0 modulo wrapSize — caller can re-wrap if needed)
    assert(near(lerpWrap(0.9, 0.1, 0.5), 1.0));
});

test('distanceAngle / lerpAngle', () =>
{
    assert(near(distanceAngle(0, 2*PI), 0));        // same direction after wrap
    assert(near(distanceAngle(0.1, -0.1), 0.2));
    // lerpAngle picks shortest path but returns un-wrapped value.
    // from -PI+0.1 to PI-0.1: shortest path is backward (through -PI), distance = -0.2
    // so result = (-PI+0.1) + 0.5*(-0.2) = -PI
    assert(near(lerpAngle(-PI+0.1, PI-0.1, 0.5), -PI, 1e-6));
});

test('isOverlapping AABB', () =>
{
    // two unit boxes centered at origin overlap
    assert.equal(isOverlapping(vec2(0, 0), vec2(1, 1), vec2(0, 0), vec2(1, 1)), true);
    // adjacent boxes do NOT overlap (edge case, uses strict inequality on one side)
    assert.equal(isOverlapping(vec2(0, 0), vec2(1, 1), vec2(2, 0), vec2(1, 1)), false);
    // partial overlap
    assert.equal(isOverlapping(vec2(0, 0), vec2(2, 2), vec2(1, 1), vec2(2, 2)), true);
    // far apart
    assert.equal(isOverlapping(vec2(0, 0), vec2(1, 1), vec2(10, 10), vec2(1, 1)), false);
});

test('isIntersecting line-vs-AABB', () =>
{
    // line passes through box
    assert.equal(isIntersecting(vec2(-5, 0), vec2(5, 0), vec2(0, 0), vec2(2, 2)), true);
    // line misses box
    assert.equal(isIntersecting(vec2(-5, 10), vec2(5, 10), vec2(0, 0), vec2(2, 2)), false);
    // line starts inside
    assert.equal(isIntersecting(vec2(0, 0), vec2(10, 0), vec2(0, 0), vec2(2, 2)), true);
});

test('vec2 constructor and factory', () =>
{
    let v = vec2();
    assert.equal(v.x, 0); assert.equal(v.y, 0);
    v = vec2(5);
    assert.equal(v.x, 5); assert.equal(v.y, 5);   // single arg copies x to y
    v = vec2(3, 4);
    assert.equal(v.x, 3); assert.equal(v.y, 4);
    v = new Vector2();
    assert.equal(v.x, 0); assert.equal(v.y, 0);
});

test('Vector2 arithmetic', () =>
{
    const a = vec2(2, 3);
    const b = vec2(4, 5);
    assert.deepEqual({ x: a.add(b).x, y: a.add(b).y }, { x: 6, y: 8 });
    assert.deepEqual({ x: a.subtract(b).x, y: a.subtract(b).y }, { x: -2, y: -2 });
    assert.deepEqual({ x: a.multiply(b).x, y: a.multiply(b).y }, { x: 8, y: 15 });
    assert.deepEqual({ x: a.scale(3).x, y: a.scale(3).y }, { x: 6, y: 9 });
    // immutability: a should be unchanged
    assert.equal(a.x, 2); assert.equal(a.y, 3);
});

test('Vector2 length / distance / dot / cross', () =>
{
    const v = vec2(3, 4);
    assert.equal(v.length(), 5);
    assert.equal(v.lengthSquared(), 25);
    assert.equal(v.distance(vec2(0, 0)), 5);
    assert.equal(v.distanceSquared(vec2(0, 0)), 25);
    assert.equal(vec2(1, 0).dot(vec2(1, 0)), 1);
    assert.equal(vec2(1, 0).dot(vec2(0, 1)), 0);
    assert.equal(vec2(1, 0).cross(vec2(0, 1)), 1);
});

test('Vector2 normalize', () =>
{
    const n = vec2(3, 4).normalize();
    assert(near(n.length(), 1));
    const scaled = vec2(3, 4).normalize(10);
    assert(near(scaled.length(), 10));
    // zero vector returns (0, length) by convention
    const zero = vec2(0, 0).normalize();
    assert(near(zero.length(), 1));
});

test('Vector2 angle conventions (up = 0)', () =>
{
    // angle() returns atan2(x, y), so up (+y) is 0
    assert(near(vec2(0, 1).angle(), 0));
    assert(near(vec2(1, 0).angle(), PI/2));
    // setAngle: x = length*sin(angle), y = length*cos(angle)
    const v = new Vector2().setAngle(0, 5);
    assert(near(v.x, 0)); assert(near(v.y, 5));
    const w = new Vector2().setAngle(PI/2, 3);
    assert(near(w.x, 3)); assert(near(w.y, 0));
});

test('Vector2 rotate preserves length', () =>
{
    const v = vec2(1, 0);
    const r = v.rotate(PI/2);
    assert(near(r.length(), 1));
    // rotate by 2pi returns roughly the original
    const full = v.rotate(2*PI);
    assert(near(full.x, 1)); assert(near(full.y, 0));
});

test('Vector2 floor / abs / mod / area', () =>
{
    assert.equal(vec2(1.7, -2.3).floor().x, 1);
    assert.equal(vec2(1.7, -2.3).floor().y, -3);
    assert.equal(vec2(-1.5, 2.5).abs().x, 1.5);
    assert.equal(vec2(-1.5, 2.5).abs().y, 2.5);
    const m = vec2(5.5, -0.5).mod(1);
    assert(near(m.x, 0.5));
    assert(near(m.y, 0.5));
    assert.equal(vec2(3, 4).area(), 12);
});

test('Vector2 lerp', () =>
{
    const r = vec2(0, 0).lerp(vec2(10, 20), 0.5);
    assert.equal(r.x, 5); assert.equal(r.y, 10);
    const zero = vec2(0, 0).lerp(vec2(10, 20), 0);
    assert.equal(zero.x, 0); assert.equal(zero.y, 0);
});

test('Color factory + defaults', () =>
{
    const w = rgb();
    assert.equal(w.r, 1); assert.equal(w.g, 1); assert.equal(w.b, 1); assert.equal(w.a, 1);
    const red = rgb(1, 0, 0);
    assert.equal(red.r, 1); assert.equal(red.g, 0); assert.equal(red.b, 0); assert.equal(red.a, 1);
});

test('Color arithmetic', () =>
{
    const a = new Color(0.5, 0.5, 0.5, 1);
    const b = new Color(0.25, 0.25, 0.25, 0);
    const sum = a.add(b);
    assert.equal(sum.r, 0.75);
    assert.equal(sum.a, 1);
    const scaled = a.scale(2);
    assert.equal(scaled.r, 1);
    assert.equal(scaled.a, 2);        // alpha also scaled
    const scaled2 = a.scale(2, 0.5);
    assert.equal(scaled2.r, 1);
    assert.equal(scaled2.a, 0.5);     // alpha scaled separately
});

test('Color lerp', () =>
{
    const a = new Color(0, 0, 0, 1);
    const b = new Color(1, 1, 1, 1);
    const mid = a.lerp(b, 0.5);
    assert.equal(mid.r, 0.5); assert.equal(mid.g, 0.5); assert.equal(mid.b, 0.5);
});

test('Color hex round-trip', () =>
{
    const red = new Color().setHex('#ff0000');
    assert(near(red.r, 1)); assert(near(red.g, 0)); assert(near(red.b, 0));
    const short = new Color().setHex('#f00');
    assert(near(short.r, 1)); assert(near(short.g, 0)); assert(near(short.b, 0));
    // toString produces hex back
    assert.equal(rgb(1, 0, 0).toString(false), '#ff0000');
    assert.equal(rgb(0, 0, 0).toString(false), '#000000');
});

test('Color rgb↔hsl round-trip', () =>
{
    const red = rgb(1, 0, 0);
    const [h, s, l, a] = red.HSLA();
    const back = hsl(h, s, l, a);
    assert(near(back.r, 1, 1e-6));
    assert(near(back.g, 0, 1e-6));
    assert(near(back.b, 0, 1e-6));
});

test('Color clamp', () =>
{
    const clamped = new Color(2, -1, 0.5, 1.5).clamp();
    assert.equal(clamped.r, 1);
    assert.equal(clamped.g, 0);
    assert.equal(clamped.b, 0.5);
    assert.equal(clamped.a, 1);
});

test('RandomGenerator determinism', () =>
{
    const r1 = new RandomGenerator(12345);
    const r2 = new RandomGenerator(12345);
    for (let i = 0; i < 10; i++)
        assert.equal(r1.float(), r2.float());

    // different seed => different sequence
    const r3 = new RandomGenerator(54321);
    const a = new RandomGenerator(12345).float();
    const b = r3.float();
    assert.notEqual(a, b);
});

test('RandomGenerator range bounds', () =>
{
    const r = new RandomGenerator(42);
    for (let i = 0; i < 100; i++)
    {
        const x = r.float();
        assert(x >= 0 && x < 1);
    }
    for (let i = 0; i < 100; i++)
    {
        const n = r.int(10);
        assert(n >= 0 && n < 10);
        assert.equal(Math.floor(n), n);
    }
});

test('rand / randInt bounds', () =>
{
    for (let i = 0; i < 100; i++)
    {
        const x = rand();
        assert(x >= 0 && x < 1);
        const y = rand(5, 10);
        assert(y >= 5 && y < 10);
    }
    for (let i = 0; i < 100; i++)
    {
        const n = randInt(4);
        assert([0, 1, 2, 3].includes(n));
    }
});
