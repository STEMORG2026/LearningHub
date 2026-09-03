import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  createSun, 
  createPlanet, 
  createBlackhole, 
  createSmallItem,
  stepPosition,
  applyBoundary,
  applyMouseForce,
  interactPair,
  applyBlackholePull,
  applyBlackholeDevour,
  updatePhysics
} from '../src/physics';
import type { CelestialBody, PhysicsInput, PhysicsResult } from '../src/types';

// E2E integration tests for physics simulation
describe('Physics Simulation E2E Flow', () => {
  const canvasWidth = 800;
  const canvasHeight = 600;
  
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should create a sun with correct properties', () => {
    const sun = createSun({ x: 400, y: 300 });
    
    expect(sun.type).toBe('sun');
    expect(sun.mass).toBeGreaterThan(0);
    expect(sun.radius).toBeGreaterThan(0);
    expect(sun.position).toEqual({ x: 400, y: 300 });
    expect(sun.velocity).toEqual({ x: 0, y: 0 });
    expect(sun.color).toBeDefined();
  });

  it('should create a planet with correct properties', () => {
    const planet = createPlanet({
      x: 500,
      y: 300,
      mass: 1e24,
      radius: 20,
      velocity: { x: 0, y: 50 }
    });
    
    expect(planet.type).toBe('planet');
    expect(planet.mass).toBe(1e24);
    expect(planet.radius).toBe(20);
    expect(planet.position).toEqual({ x: 500, y: 300 });
    expect(planet.velocity).toEqual({ x: 0, y: 50 });
  });

  it('should create a blackhole with correct properties', () => {
    const blackhole = createBlackhole({ x: 400, y: 300 });
    
    expect(blackhole.type).toBe('blackhole');
    expect(blackhole.mass).toBeGreaterThan(0);
    expect(blackhole.eventHorizonRadius).toBeGreaterThan(0);
    expect(blackhole.position).toEqual({ x: 400, y: 300 });
  });

  it('should create a small item with correct properties', () => {
    const item = createSmallItem({ x: 100, y: 100 });
    
    expect(item.type).toBe('item');
    expect(item.mass).toBeGreaterThan(0);
    expect(item.radius).toBeGreaterThan(0);
    expect(item.position).toEqual({ x: 100, y: 100 });
  });

  it('should step position correctly', () => {
    const body: CelestialBody = {
      id: 'test-1',
      type: 'planet',
      mass: 1e24,
      radius: 20,
      position: { x: 100, y: 100 },
      velocity: { x: 10, y: 20 },
      color: '#fff',
    };
    
    const newPosition = stepPosition(body, 1.0);
    expect(newPosition.x).toBe(110);
    expect(newPosition.y).toBe(120);
  });

  it('should apply boundary conditions', () => {
    // Body at left edge moving left
    let body: CelestialBody = {
      id: 'test-2',
      type: 'item',
      mass: 1,
      radius: 5,
      position: { x: -10, y: 300 },
      velocity: { x: -10, y: 0 },
      color: '#fff',
    };
    
    body = applyBoundary(body, canvasWidth, canvasHeight);
    expect(body.position.x).toBeGreaterThanOrEqual(0);
    expect(body.velocity.x).toBeGreaterThanOrEqual(0); // Bounced
    
    // Body at right edge moving right
    body = {
      id: 'test-3',
      type: 'item',
      mass: 1,
      radius: 5,
      position: { x: canvasWidth + 10, y: 300 },
      velocity: { x: 10, y: 0 },
      color: '#fff',
    };
    
    body = applyBoundary(body, canvasWidth, canvasHeight);
    expect(body.position.x).toBeLessThanOrEqual(canvasWidth);
    expect(body.velocity.x).toBeLessThanOrEqual(0); // Bounced
  });

  it('should apply mouse force correctly', () => {
    const body: CelestialBody = {
      id: 'test-4',
      type: 'item',
      mass: 1,
      radius: 5,
      position: { x: 100, y: 100 },
      velocity: { x: 0, y: 0 },
      color: '#fff',
    };
    
    const mousePos = { x: 200, y: 100 };
    const newVelocity = applyMouseForce(body, mousePos, 100);
    
    // Force should push body toward mouse
    expect(newVelocity.x).toBeGreaterThan(0);
    expect(newVelocity.y).toBe(0);
  });

  it('should interact pair correctly (gravity)', () => {
    const sun: CelestialBody = {
      id: 'sun',
      type: 'sun',
      mass: 1e30,
      radius: 50,
      position: { x: 400, y: 300 },
      velocity: { x: 0, y: 0 },
      color: '#fff',
    };
    
    const planet: CelestialBody = {
      id: 'planet',
      type: 'planet',
      mass: 1e24,
      radius: 20,
      position: { x: 500, y: 300 },
      velocity: { x: 0, y: 0 },
      color: '#fff',
    };
    
    const { body1: newSun, body2: newPlanet } = interactPair(sun, planet);
    
    // Both bodies should have updated velocities due to mutual gravity
    expect(newSun.velocity.x).not.toBe(0);
    expect(newSun.velocity.y).not.toBe(0);
    expect(newPlanet.velocity.x).not.toBe(0);
    expect(newPlanet.velocity.y).not.toBe(0);
  });

  it('should apply blackhole pull', () => {
    const blackhole: CelestialBody = {
      id: 'bh',
      type: 'blackhole',
      mass: 1e31,
      radius: 30,
      eventHorizonRadius: 50,
      position: { x: 400, y: 300 },
      velocity: { x: 0, y: 0 },
      color: '#000',
    };
    
    const item: CelestialBody = {
      id: 'item',
      type: 'item',
      mass: 1,
      radius: 5,
      position: { x: 500, y: 300 },
      velocity: { x: 0, y: 0 },
      color: '#fff',
    };
    
    const pulledItem = applyBlackholePull(blackhole, item);
    
    // Item should be pulled toward blackhole
    expect(pulledItem.velocity.x).toBeLessThan(0); // Toward blackhole at x=400
  });

  it('should devour items within event horizon', () => {
    const blackhole: CelestialBody = {
      id: 'bh',
      type: 'blackhole',
      mass: 1e31,
      radius: 30,
      eventHorizonRadius: 100,
      position: { x: 400, y: 300 },
      velocity: { x: 0, y: 0 },
      color: '#000',
    };
    
    const item: CelestialBody = {
      id: 'item',
      type: 'item',
      mass: 1,
      radius: 5,
      position: { x: 450, y: 300 }, // Within event horizon (100 radius)
      velocity: { x: 0, y: 0 },
      color: '#fff',
    };
    
    const result = applyBlackholeDevour(blackhole, item);
    
    // Item should be devoured (removed)
    expect(result.devoured).toBe(true);
  });

  it('should update physics for multiple bodies', () => {
    const bodies: CelestialBody[] = [
      createSun({ x: 400, y: 300 }),
      createPlanet({ x: 500, y: 300, velocity: { x: 0, y: 50 } }),
      createSmallItem({ x: 600, y: 300 }),
    ];
    
    const input: PhysicsInput = {
      bodies,
      canvasWidth,
      canvasHeight,
      mousePosition: null,
      deltaTime: 1.0,
    };
    
    const result: PhysicsResult = updatePhysics(input);
    
    expect(result.bodies).toHaveLength(3);
    // All bodies should have updated positions
    result.bodies.forEach(body => {
      expect(body.position).toBeDefined();
      expect(body.velocity).toBeDefined();
    });
  });

  it('should handle full simulation loop', () => {
    const bodies: CelestialBody[] = [
      createSun({ x: 400, y: 300 }),
      createPlanet({ x: 500, y: 300, velocity: { x: 0, y: 50 } }),
    ];
    
    // Run multiple simulation steps
    for (let i = 0; i < 10; i++) {
      const input: PhysicsInput = {
        bodies,
        canvasWidth,
        canvasHeight,
        mousePosition: null,
        deltaTime: 1.0,
      };
      
      const result = updatePhysics(input);
      bodies = result.bodies;
      
      // Verify bodies still exist and have valid state
      expect(bodies).toHaveLength(2);
      bodies.forEach(body => {
        expect(body.position.x).toBeGreaterThanOrEqual(0);
        expect(body.position.x).toBeLessThanOrEqual(canvasWidth);
        expect(body.position.y).toBeGreaterThanOrEqual(0);
        expect(body.position.y).toBeLessThanOrEqual(canvasHeight);
      });
    }
  });

  it('should handle mouse interaction in simulation', () => {
    const bodies: CelestialBody[] = [
      createSun({ x: 400, y: 300 }),
      createPlanet({ x: 500, y: 300 }),
    ];
    
    const input: PhysicsInput = {
      bodies,
      canvasWidth,
      canvasHeight,
      mousePosition: { x: 200, y: 200 },
      deltaTime: 1.0,
    };
    
    const result = updatePhysics(input);
    
    // Planets should be affected by mouse force
    expect(result.bodies).toHaveLength(2);
    result.bodies.forEach(body => {
      expect(body.position).toBeDefined();
      expect(body.velocity).toBeDefined();
    });
  });

  it('should maintain energy conservation approximately', () => {
    const bodies: CelestialBody[] = [
      createSun({ x: 400, y: 300 }),
      createPlanet({ x: 500, y: 300, velocity: { x: 0, y: 50 } }),
    ];
    
    const initialEnergy = bodies.reduce((sum, b) => sum + 0.5 * b.mass * (b.velocity.x ** 2 + b.velocity.y ** 2), 0);
    
    // Run simulation
    for (let i = 0; i < 100; i++) {
      const input: PhysicsInput = {
        bodies,
        canvasWidth,
        canvasHeight,
        mousePosition: null,
        deltaTime: 0.1,
      };
      
      const result = updatePhysics(input);
      bodies = result.bodies;
    }
    
    const finalEnergy = bodies.reduce((sum, b) => sum + 0.5 * b.mass * (b.velocity.x ** 2 + b.velocity.y ** 2), 0);
    
    // Energy should be approximately conserved (within 10%)
    expect(Math.abs(finalEnergy - initialEnergy) / initialEnergy).toBeLessThan(0.1);
  });
});