/**
 * WORKER BRIDGE
 * Manages communication and data synchronization between the Main Thread and Web Workers.
 * Uses SharedArrayBuffer and Atomics for zero-copy data sharing where possible.
 */

export const WorkerMessageType = {
  INIT: 'INIT',
  STEP: 'STEP',
  SYNC_BODIES: 'SYNC_BODIES',
  UPDATE_CONFIG: 'UPDATE_CONFIG'
} as const;

export type WorkerMessageType = typeof WorkerMessageType[keyof typeof WorkerMessageType];

export type WorkerMessage = {
  type: WorkerMessageType;
  payload?: any;
};

export class WorkerBridge {
  private worker: Worker | null = null;

  // Shared Memory for Transform Synchronization (Position + Rotation)
  // Layout per entity: [x, y, z, qx, qy, qz, qw] (7 floats)
  private sharedBuffer: SharedArrayBuffer | null = null;
  private sharedView: Float32Array | null = null;
  // private entityMap: Map<string, number> = new Map(); // EntityID -> Index in buffer

  // Atomics for synchronization locks
  private atomicsBuffer: SharedArrayBuffer | null = null;
  // private atomicsView: Int32Array | null = null;

  constructor(workerPath: string) {
    if (typeof Worker !== 'undefined') {
      // Create worker as module
      this.worker = new Worker(new URL(workerPath, import.meta.url), { type: 'module' });
      this.worker.onmessage = this.handleMessage.bind(this);
      this.worker.onerror = (e) => console.error("[WorkerBridge] Error:", e);

      console.log(`[WorkerBridge] Worker initialized: ${workerPath}`);
    } else {
      console.error("[WorkerBridge] Web Workers not supported!");
    }
  }

  /**
   * Initialize SharedArrayBuffer for high-performance data sync.
   * @param maxEntities Maximum number of physics entities to sync.
   */
  public initSharedMemory(maxEntities: number) {
    const FLOAT_SIZE = 4;
    const STRIDE = 7; // pos(3) + rot(4)
    const bufferSize = maxEntities * STRIDE * FLOAT_SIZE;

    try {
        this.sharedBuffer = new SharedArrayBuffer(bufferSize);
        this.sharedView = new Float32Array(this.sharedBuffer);

        // Atomic flag for "Writing in progress"
        this.atomicsBuffer = new SharedArrayBuffer(4);
        // this.atomicsView = new Int32Array(this.atomicsBuffer);

        console.log(`[WorkerBridge] SharedArrayBuffer allocated: ${bufferSize} bytes`);

        // Send buffers to worker
        this.postMessage({
            type: WorkerMessageType.INIT,
            payload: {
                sharedBuffer: this.sharedBuffer,
                atomicsBuffer: this.atomicsBuffer,
                maxEntities
            }
        });

    } catch (e) {
        console.error("[WorkerBridge] Failed to create SharedArrayBuffer. Check COOP/COEP headers.", e);
    }
  }

  public postMessage(msg: WorkerMessage, transfer?: Transferable[]) {
    this.worker?.postMessage(msg, transfer || []);
  }

  private handleMessage(e: MessageEvent) {
      const msg = e.data as WorkerMessage;
      switch (msg.type) {
          case WorkerMessageType.SYNC_BODIES:
              // Notify main thread that physics step is done and data is ready in SharedBuffer
              // logic...
              break;
          default:
              console.log("[WorkerBridge] Received:", msg);
      }
  }

  public terminate() {
      this.worker?.terminate();
  }

  /**
   * Reads the shared buffer for a specific entity index.
   * Uses Atomics to ensure thread safety if needed (though usually we just read latest).
   */
  public getTransform(index: number, outPos: Float32Array, outRot: Float32Array) {
      if (!this.sharedView) return;
      const STRIDE = 7;
      const offset = index * STRIDE;

      // Ideally check Atomics.load(this.atomicsView, 0) == 0 (not writing)

      outPos[0] = this.sharedView[offset + 0];
      outPos[1] = this.sharedView[offset + 1];
      outPos[2] = this.sharedView[offset + 2];

      outRot[0] = this.sharedView[offset + 3];
      outRot[1] = this.sharedView[offset + 4];
      outRot[2] = this.sharedView[offset + 5];
      outRot[3] = this.sharedView[offset + 6];
  }
}
