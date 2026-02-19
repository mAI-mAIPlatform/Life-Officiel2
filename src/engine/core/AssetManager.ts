import { LoadingManager, WebGLRenderer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

/**
 * ASSET MANAGER
 * Handles async loading/unloading of textures and models with compression support.
 */
export class AssetManager {
  private manager: LoadingManager;
  private gltfLoader: GLTFLoader;
  // private textureLoader: TextureLoader;
  private ktx2Loader: KTX2Loader;

  private assets: Map<string, GLTF | any> = new Map();
  private pending: Map<string, Promise<any>> = new Map();

  constructor() {
      this.manager = new LoadingManager();
      this.gltfLoader = new GLTFLoader(this.manager);
      // this.textureLoader = new TextureLoader(this.manager); // Unused
      this.ktx2Loader = new KTX2Loader(this.manager);

      // Meshopt is standard for high-performance GLTF
      this.gltfLoader.setMeshoptDecoder(MeshoptDecoder);
  }

  /**
   * Initialize GPU-dependent loaders (KTX2/Basis).
   * Must be called after the Renderer is created.
   */
  public init(renderer: WebGLRenderer) {
      this.ktx2Loader.setTranscoderPath('https://unpkg.com/three@0.160.0/examples/jsm/libs/basis/');
      this.ktx2Loader.detectSupport(renderer);
      this.gltfLoader.setKTX2Loader(this.ktx2Loader);
      console.log("[AssetManager] KTX2/Basis Transcoder initialized");
  }

  public async loadGLTF(url: string): Promise<GLTF> {
      if (this.assets.has(url)) return this.assets.get(url);
      if (this.pending.has(url)) return this.pending.get(url);

      const promise = new Promise<GLTF>((resolve, reject) => {
          this.gltfLoader.load(url, (gltf) => {
              this.assets.set(url, gltf);
              this.pending.delete(url);
              resolve(gltf);
          }, undefined, reject);
      });

      this.pending.set(url, promise);
      return promise;
  }

  public getAsset(url: string) {
      return this.assets.get(url);
  }
}

export const assetManager = new AssetManager();
