import * as THREE from 'three'

export class Terrain {

    private m_scene: THREE.Scene;
    private geometry!: THREE.PlaneGeometry;
    private heightData: number[] = [];
    private readonly numSegments = 255;
    private readonly size = 2400;
    private originX = -50;   // same values you pass to makeTranslation
    private originZ = -10;

    constructor(scene: THREE.Scene) {
        this.m_scene = scene;
    }

    public initialise(heightMap: any, terrainTex: any) {

        // Get the data from the texture
        let imagedata = this.GetImageData(heightMap);
        let pixelData = imagedata.data;
        let heightData = [];

        for (let i = 0; i < pixelData.length; i += 4) {
            // RGB elements are combined & the alpha value is skipped
            heightData.push((pixelData[i] + pixelData[i + 1] + pixelData[i + 2]) / 10);
        }
        this.heightData = heightData;
        this.CreateGeometry(this.originX, this.originZ, heightData, terrainTex);
        //this.CreateGeometry(-50, -10, heightData, terrainTex);
    }

    // Function to Create a Tile that represents the heightmap
    private CreateGeometry(x: any, z: any, heightData: any, terrainTex: any): void {

        let numSegments = 255;

        // Create a plane PlaneGeometry(width, height, widthSegments, heightSegments)
        this.geometry = new THREE.PlaneGeometry(2400, 2400, numSegments, numSegments);
        this.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        this.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(x, 0, z));
        this.geometry.name = "Terrain";

        // Iterate through the plane & adjust the height values accordingly
        let vertices = this.geometry.attributes.position;
        for (let i = 0; i < vertices.count; i++) {
            vertices.setY(i, heightData[i]);
        }
        vertices.needsUpdate = true;

        let texture = new THREE.CanvasTexture(terrainTex);
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        let mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({ map: texture }));
        this.m_scene.add(mesh);
    }

    // Method to extract the data from the Image
    private GetImageData(image: any) {
        let canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error("getContext('2d') failed");
        }
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, image.width, image.height);
    }


    public getHeight(x: number, z: number): number {
        const n = this.numSegments;
        const stride = n + 1;               // vertices per row (256)
        const half = this.size / 2;

        // World -> grid coordinates (0..n)
        const u = ((x - (this.originX - half)) / this.size) * n;
        const v = ((z - (this.originZ - half)) / this.size) * n;

        // Outside the terrain
        if (u < 0 || v < 0 || u > n || v > n) return 0;

        const col = Math.min(Math.floor(u), n - 1);
        const row = Math.min(Math.floor(v), n - 1);
        const fx = u - col;                 // 0..1 within the cell
        const fz = v - row;

        const h = (r: number, c: number) => this.heightData[r * stride + c];
        const h00 = h(row, col);
        const h10 = h(row, col + 1);
        const h01 = h(row + 1, col);
        const h11 = h(row + 1, col + 1);

        // PlaneGeometry splits each cell along the (col,row+1)-(col+1,row) diagonal,
        // so interpolate on whichever triangle we're in. This matches what's rendered.
        if (fx + fz <= 1) {
            return h00 + (h10 - h00) * fx + (h01 - h00) * fz;
        }
        return h11 + (h01 - h11) * (1 - fx) + (h10 - h11) * (1 - fz);
    }

    public old_getHeight(x: number, z: number): number {

        //Calculate which cell we are in
        let indexBase: number = 0;
        const _terrainStartX = 0;
        const _terrainStartZ = 0;
        const _spacing = 10;
        const _gridSize = 256;
        const _numCellCols = 255;
        // const _numCellRows = 255;

        const _cellX = ((x - _terrainStartX) / _spacing);
        const _cellZ = ((_terrainStartZ - z) / _spacing);

        const verticesIndex = Math.abs(_cellZ * _gridSize + _cellX);

        //this.geometry.attributes.position.array
        // const _dx = x - this.geometry.userData.vertices[verticesIndex].x;
        const _dx = x - this.geometry.attributes.position.array[verticesIndex];

        // const _dz = z - this.geometry.userData.vertices[verticesIndex].z;
        const _dz = x - this.geometry.attributes.position.array[verticesIndex];

        // Get the first index of the triangle we are positioned in
        // We are in triangle V0,V1,V2
        if (_dz > _dx) {
            indexBase = (_cellZ * _numCellCols + _cellX) * 6;
        }
        // We are in triangle V0,V2,V3
        else {
            indexBase = (_cellZ * _numCellCols + _cellX) * 6 + 3;
        }

        console.log(indexBase);

        // v0---v1
        // |\   | <-dx->
        // | \  |   /\
        // |  \ |   dz
        // |   \|   \/
        // v3---v2

        //const index0 = _indices[indexBase];
        //const index1 = _indices[indexBase + 1];
        //const index2 = _indices[indexBase + 2];

        let _point: THREE.Vector3 = new THREE.Vector3(_dx, 0.0, _dz);

        // Calculate the Triangle Normal
        const _u: THREE.Vector3 = new THREE.Vector3(0.3, 0.3, 0.3);
        //_vertices[index1].position.x - _vertices[index0].position.x,
        //_vertices[index1].position.y - _vertices[index0].position.y,
        //_vertices[index1].position.z - _vertices[index0].position.z);

        const _v: THREE.Vector3 = new THREE.Vector3(0.2, 0.2, 0.2);
        //_vertices[index2].position.x - _vertices[index0].position.x,
        //_vertices[index2].position.y - _vertices[index0].position.y,
        //_vertices[index2].position.z - _vertices[index0].position.z);

        const _normal: THREE.Vector3 = new THREE.Vector3;
        _normal.crossVectors(_u, _v);
        _normal.normalize();

        const Nx = _normal.x;
        const Nz = _normal.z;
        const Ny = _normal.y;

        // let _v0 = this.geometry.userData.vertices[0].y;//[index0]
        let _v0 = this.geometry.attributes.position.array[0]

        return _point.y = _v0 + ((Nx * _dx) + (Nz * _dz) / -Ny);
    }
}
