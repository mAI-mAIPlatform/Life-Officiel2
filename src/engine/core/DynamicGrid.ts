import { Vector3 } from 'three';

/**
 * LOD LEVELS
 * Defines the fidelity and simulation frequency of a chunk.
 */
export const LODLevel = {
  HIGH: 0,   // Active Physics, High Poly, AI @ 60Hz
  MEDIUM: 1, // Simplified Physics (Kinematic), Med Poly, AI @ 10Hz
  LOW: 2,    // No Physics, Impostors/Billboards, No AI
  HIDDEN: 3  // Unloaded
} as const;

export type LODLevel = typeof LODLevel[keyof typeof LODLevel];

export type ChunkID = string; // Format: "x_z"

export class DynamicGridSystem {
  private chunkSize: number = 100; // 100x100m chunks
  private activeChunks: Map<ChunkID, LODLevel> = new Map();
  private playerChunk: { x: number, z: number } = { x: 0, z: 0 };

  // Configuration for LOD ranges (in chunks distance)
  private readonly ranges = {
    high: 1, // Current + adjacent 1 (3x3 grid)
    medium: 2, // 5x5 grid
    low: 4     // 9x9 grid
  };

  constructor() {}

  /**
   * Updates the grid based on the player's current position.
   * Calculates which chunks should be loaded/unloaded or change LOD.
   * @param playerPos Current player position
   */
  public update(playerPos: Vector3) {
    const cx = Math.floor(playerPos.x / this.chunkSize);
    const cz = Math.floor(playerPos.z / this.chunkSize);

    // Only update if player changed chunk
    if (cx === this.playerChunk.x && cz === this.playerChunk.z) {
        return;
    }

    this.playerChunk = { x: cx, z: cz };
    this.recalculateLODs(cx, cz);
  }

  private recalculateLODs(cx: number, cz: number) {
      const newActiveChunks = new Map<ChunkID, LODLevel>();

      // Iterate over the maximum range (Low priority area)
      const range = this.ranges.low;

      for (let x = -range; x <= range; x++) {
          for (let z = -range; z <= range; z++) {
              const chunkX = cx + x;
              const chunkZ = cz + z;
              const id = this.getChunkID(chunkX, chunkZ);

              const dist = Math.max(Math.abs(x), Math.abs(z));
              let lod: LODLevel = LODLevel.HIDDEN;

              if (dist <= this.ranges.high) {
                  lod = LODLevel.HIGH;
              } else if (dist <= this.ranges.medium) {
                  lod = LODLevel.MEDIUM;
              } else if (dist <= this.ranges.low) {
                  lod = LODLevel.LOW;
              }

              if (lod !== LODLevel.HIDDEN) {
                  newActiveChunks.set(id, lod);
                  this.processChunk(id, chunkX, chunkZ, lod);
              }
          }
      }

      // Handle unloading
      for (const [id] of this.activeChunks) {
          if (!newActiveChunks.has(id)) {
              this.unloadChunk(id);
          }
      }

      this.activeChunks = newActiveChunks;
  }

  private getChunkID(x: number, z: number): ChunkID {
      return `${x}_${z}`;
  }

  private processChunk(id: ChunkID, _x: number, _z: number, lod: LODLevel) {
      const currentLOD = this.activeChunks.get(id);

      if (currentLOD !== lod) {
          // LOD Changed or New Chunk
          // console.log(`Chunk ${id} -> LOD ${LODLevel[lod]}`);
          // TODO: Emit event or call AssetManager to load/unload resources
          // e.g., signalECS(id, lod);
      }
  }

  private unloadChunk(_id: ChunkID) {
      // console.log(`Unloading Chunk ${id}`);
      // TODO: Cleanup entities in this chunk
  }
}

export const dynamicGrid = new DynamicGridSystem();
