import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    EngineObject, ParticleEmitter, TileLayerData, TileInfo,
    Timer, tile, vec2, rgb,
} from '../dist/littlejs.esm.js';

// Tier 2-lite: verify core engine primitives can be constructed without
// crashing or tripping ASSERTs (debug bundle keeps them live). We do NOT
// boot the engine via engineInit and we do NOT call render() (which would
// require a canvas context). update() on the base EngineObject is safe
// because the default is a no-op.

test('import does not throw', () =>
{
    // Just reaching this line means the bundle loaded under our stubs.
    assert(true);
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
