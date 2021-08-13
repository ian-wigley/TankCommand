import THREE = require("three");
declare class Terrain {
    m_scene: THREE.Scene;
    worldWidth: number;
    levels: number;
    resolution: number;
    terrainTex: any;
    heightData: any[];
    constructor(heightMap: any, terrainTex: any, scene: THREE.Scene);
    private BuildMesh;
    private CreateTiles;
    private GetImageData;
}
export = Terrain;
