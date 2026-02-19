import { World } from 'miniplex';
import { Vector3, Quaternion } from 'three';

/**
 * COMPONENT DEFINITIONS
 *
 * We adhere to a Data-Oriented approach where possible.
 * While Miniplex is an Object-based ECS (AoS), we use TypedArrays for complex component data
 * to minimize GC pressure and improve cache locality for heavy calculations.
 */

export const TagFlags = {
  IsPlayer: 1 << 0,
  IsEnemy: 1 << 1,
  IsInteractable: 1 << 2,
  IsVisible: 1 << 3,
  IsDynamic: 1 << 4,
};

export type TransformComponent = {
  position: Vector3;
  rotation: Quaternion;
  scale: Vector3;
  parentID?: string; // For hierarchy
};

export type RigidBodyComponent = {
  mass: number;
  friction: number;
  restitution: number;
  colliderShape: 'cuboid' | 'ball' | 'capsule' | 'trimesh';
  args: number[]; // Dimensions [width, height, depth] or [radius]
  sensor: boolean;
  collisionGroups: number;

  // Runtime Runtime Handle (populated after physics creation)
  bodyHandle?: number;
};

export type RenderComponent = {
  modelRef: string; // Key for AssetManager
  lodLevel: number; // 0=High, 1=Med, 2=Low/Impostor
  visible: boolean;
  castShadow: boolean;
  receiveShadow: boolean;

  // Instance ID for InstancedMesh rendering (optimization)
  instanceId?: number;
};

// Layout: [HP, MaxHP, Hunger, Stamina, Stress, Hygiene, Bladder, Addiction, Toxicity]
export const STATS_OFFSET = {
  HP: 0,
  MAX_HP: 1,
  HUNGER: 2,
  STAMINA: 3,
  STRESS: 4,
  HYGIENE: 5,
  BLADDER: 6,
  ADDICTION: 7,
  TOXICITY: 8
};

export type CharacterStatsComponent = {
  // Using Float32Array for contiguous memory block
  data: Float32Array;
};

// Input Ring Buffer for Prediction
// Layout per entry: [MoveX, MoveZ, AimX, AimZ, ActionsBitmask, Timestamp] (6 floats)
export const INPUT_FRAME_SIZE = 6;
export const INPUT_BUFFER_CAPACITY = 120; // 2 seconds of history at 60fps

export type InputStateComponent = {
  buffer: Float32Array;
  writeIndex: number; // Current head of the circular buffer
};

export type AIStateComponent = {
  currentBehavior: number; // Enum integer
  targetEntityID?: string;
  pathingNodes?: Float32Array; // Flattened [x, y, z, x, y, z...]
  alertness: number;
  memoryBuffer: Int8Array; // Specific memory flags/counters
};

export type TagComponent = {
  flags: number; // Bitmask using TagFlags
};

/**
 * THE ENTITY TYPE
 * Union of all possible components.
 */
export type Entity = {
  id: string; // UUID

  transform?: TransformComponent;
  rigidBody?: RigidBodyComponent;
  render?: RenderComponent;
  stats?: CharacterStatsComponent;
  input?: InputStateComponent;
  ai?: AIStateComponent;
  tags?: TagComponent;

  // Lifecycle flags
  autoDestroy?: boolean;
};

/**
 * THE WORLD
 * The central ECS registry.
 */
export const world = new World<Entity>();

/**
 * HELPER FUNCTIONS
 */

export const createTransform = (
  p: [number, number, number] = [0, 0, 0],
  r: [number, number, number, number] = [0, 0, 0, 1],
  s: [number, number, number] = [1, 1, 1]
): TransformComponent => ({
  position: new Vector3(p[0], p[1], p[2]),
  rotation: new Quaternion(r[0], r[1], r[2], r[3]),
  scale: new Vector3(s[0], s[1], s[2])
});

export const createStats = (hp: number = 100): CharacterStatsComponent => {
  const data = new Float32Array(9);
  data[STATS_OFFSET.HP] = hp;
  data[STATS_OFFSET.MAX_HP] = hp;
  data[STATS_OFFSET.HUNGER] = 100;
  data[STATS_OFFSET.STAMINA] = 100;
  return { data };
};

export const createInputBuffer = (): InputStateComponent => ({
  buffer: new Float32Array(INPUT_BUFFER_CAPACITY * INPUT_FRAME_SIZE),
  writeIndex: 0
});

export const createTags = (flags: number = 0): TagComponent => ({
    flags
});
