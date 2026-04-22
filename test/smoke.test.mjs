import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    EngineObject, ParticleEmitter, TileLayerData, TileInfo,
    Timer, tile, vec2, rgb,
} from '../dist/littlejs.esm.js';

const near = (a, b, eps=1e-9) => Math.abs(a - b) <= eps;

// Tier 2-lite: verify core engine primitives can be constructed without
// crashing or tripping ASSERTs (debug bundle keeps them live). We do NOT
// boot the engine via engineInit and we do NOT call render() (which would
// require a canvas context). update() on the base EngineObject is safe
// because the default is a no-op.

test('bundle exposes core engine symbols', () =>
{
    // If the bundle failed to load under our stubs, this file wouldn't
    // have imported at all — so reaching here proves import succeeded.
    // These checks also guard against an export regression stripping
    // core names from the public surface.
    assert.equal(typeof EngineObject, 'function');
    assert.equal(typeof Timer, 'function');
    assert.equal(typeof tile, 'function');
    assert.equal(typeof vec2, 'function');
});

test('EngineObject constructs and base update is safe', () =>
{
    const o = new EngineObject(vec2(0, 0), vec2(1, 1));
    assert.equal(o.pos.x, 0);
    assert.equal(o.pos.y, 0);
    assert.equal(o.size.x, 1);
    assert.equal(o.size.y, 1);
    // base class update is an empty method — calling it should not throw
    assert.doesNotThrow(() => o.update());
});

test('EngineObject with color and angle constructs', () =>
{
    const o = new EngineObject(vec2(5, -3), vec2(2, 2), undefined, Math.PI/4, rgb(1, 0, 0));
    assert.equal(o.pos.x, 5);
    assert.equal(o.angle, Math.PI/4);
});

test('tile() returns a TileInfo', () =>
{
    const t = tile(0, 16);
    assert(t instanceof TileInfo);
});

test('ParticleEmitter constructs with defaults', () =>
{
    // minimum reasonable args: pos, angle, emitSize, emitTime, emitRate
    const e = new ParticleEmitter(vec2(0, 0), 0, 0, 0, 0);
    assert(e instanceof ParticleEmitter);
    assert(e instanceof EngineObject);
});

test('TileLayerData constructs', () =>
{
    // TileLayerData(tile, direction, mirror, color) — minimal form
    assert.doesNotThrow(() => new TileLayerData(0));
    assert.doesNotThrow(() => new TileLayerData(5, 1, false));
});

test('Timer lifecycle (unset -> set -> elapsed check)', () =>
{
    const t = new Timer();
    assert.equal(t.isSet(), false);
    assert.equal(t.get(), 0);              // returns 0 when unset
    assert.equal(t.getSetTime(), 0);
    t.set(1);
    assert.equal(t.isSet(), true);
    assert.equal(t.getSetTime(), 1);
    t.unset();
    assert.equal(t.isSet(), false);
});

test('Timer constructed with duration is set', () =>
{
    const t = new Timer(5);
    assert.equal(t.isSet(), true);
    assert.equal(t.getSetTime(), 5);
});

// The engine's `time` global stays at 0 because the main loop never runs
// in headless mode without engineInit. That lets us check time-derived
// Timer methods against known reference points.

test('Timer active / elapsed / get for a fresh positive-duration timer', () =>
{
    const t = new Timer(1);
    assert.equal(t.active(), true);                  // time(0) < setAt(1)
    assert.equal(t.elapsed(), false);
    assert(near(t.get(), -1));                       // negative = still active
});

test('Timer active / elapsed / get for an already-elapsed timer', () =>
{
    // negative duration -> timer's internal target is in the past
    const t = new Timer(-2);
    assert.equal(t.active(), false);
    assert.equal(t.elapsed(), true);
    assert(near(t.get(), 2));                        // positive = how long since elapsed
});

test('Timer with zero duration is immediately elapsed', () =>
{
    const t = new Timer(0);
    assert.equal(t.active(), false);
    assert.equal(t.elapsed(), true);
    assert(near(t.get(), 0));
});

test('Timer getPercent for fresh positive-duration timer is 0', () =>
{
    // at time=0 with a timer set for duration 1, no time has elapsed yet
    assert(near(new Timer(1).getPercent(), 0));
});

test('Timer unset returns 0 from get/getPercent/getSetTime', () =>
{
    const t = new Timer();
    assert.equal(t.isSet(), false);
    assert.equal(t.get(), 0);
    assert.equal(t.getPercent(), 0);
    assert.equal(t.getSetTime(), 0);
});
