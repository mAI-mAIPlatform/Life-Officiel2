import { Vector3, Quaternion, Matrix4 } from 'three';

/**
 * Interface for objects that can be reset when retrieved from the pool.
 */
export interface Poolable {
  reset(): void;
}

/**
 * Generic Object Pool with type safety.
 * Optimized for high-frequency usage in the game loop.
 *
 * @template T The type of object in the pool.
 */
export class ObjectPool<T> {
  private pool: T[] = [];
  private factory: () => T;
  private resetFn?: (obj: T) => void;

  public metrics = {
    totalAllocated: 0,
    active: 0,
    peakActive: 0
  };

  /**
   * @param factory Function to create a new instance of T.
   * @param resetFn Optional function to reset the object state on reuse.
   * @param initialSize Number of objects to pre-allocate (Warmup).
   */
  constructor(factory: () => T, resetFn?: (obj: T) => void, initialSize: number = 0) {
    this.factory = factory;
    this.resetFn = resetFn;

    // Warmup
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createInstance());
    }
    this.metrics.totalAllocated = initialSize;
  }

  private createInstance(): T {
    return this.factory();
  }

  /**
   * Retrieves an object from the pool.
   * If the pool is empty, a new object is created.
   * O(1) complexity.
   */
  public get(): T {
    let obj: T;
    if (this.pool.length > 0) {
      obj = this.pool.pop()!;
    } else {
      obj = this.createInstance();
      this.metrics.totalAllocated++;
    }

    this.metrics.active++;
    if (this.metrics.active > this.metrics.peakActive) {
        this.metrics.peakActive = this.metrics.active;
    }

    // Auto-reset if provided
    if (this.resetFn) {
        this.resetFn(obj);
    }

    return obj;
  }

  /**
   * Returns an object to the pool.
   * O(1) complexity.
   * @param obj The object to release.
   */
  public release(obj: T): void {
    this.pool.push(obj);
    this.metrics.active--;
  }

  /**
   * Returns the number of inactive objects currently in the pool.
   */
  public size(): number {
      return this.pool.length;
  }
}

/**
 * Specialized pools for Three.js Math primitives.
 * These are CRITICAL for 60fps performance to avoid GC spikes.
 * Using these prevents "Stop-the-world" GC pauses during gameplay.
 */

// Vector3 is the most used primitive. Pre-allocate heavily.
export const Vec3Pool = new ObjectPool<Vector3>(
  () => new Vector3(),
  (v) => v.set(0, 0, 0),
  1000
);

export const QuatPool = new ObjectPool<Quaternion>(
  () => new Quaternion(),
  (q) => q.identity(),
  500
);

export const Mat4Pool = new ObjectPool<Matrix4>(
  () => new Matrix4(),
  (m) => m.identity(),
  100
);
