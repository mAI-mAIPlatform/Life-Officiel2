import { loopManager } from '../core/LoopManager';

type System = (dt: number) => void;

/**
 * SYSTEM MANAGER
 * Orchestrates the execution of ECS Systems during the Fixed Update loop.
 */
export class SystemManager {
  private systems: System[] = [];

  constructor() {
    // Automatically hook into the game loop
    loopManager.registerFixedUpdate(this.update.bind(this));
    console.log("[SystemManager] Initialized and hooked into LoopManager");
  }

  /**
   * Register a system function to be called every fixed update.
   * Systems are executed in order of registration.
   */
  public register(system: System) {
    this.systems.push(system);
  }

  /**
   * Run all registered systems.
   * @param dt Fixed timestep (e.g., 0.016s)
   */
  private update(dt: number) {
    for (const system of this.systems) {
      try {
        system(dt);
      } catch (e) {
        console.error("System Error:", e);
      }
    }
  }
}

export const systemManager = new SystemManager();
