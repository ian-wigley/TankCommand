import THREE = require("three");
declare class Terrain {
    private m_scene;
    private geometry;
    constructor(scene: THREE.Scene);
    initialise(heightMap: any, terrainTex: any): void;
    private CreateTiles;
    private GetImageData;
    getHeight(x: number, z: number): number;
}
export = Terrain;
