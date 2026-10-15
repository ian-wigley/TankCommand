import * as THREE from 'three'

export class Terrain {

    private m_scene: THREE.Scene;
    private geometry!: THREE.PlaneGeometry;
    private heightData: number[] = [];
    private readonly numSegments = 255;
    private readonly size = 2400;
    private originX = -50;
    private originZ = -10;

    constructor(scene: THREE.Scene) {
        this.m_scene = scene;
    }

    public initialise(heightMap: any, terrainTex: any): void {

        // Get the data from the texture
        let imageData = this.GetImageData(heightMap);
        let pixelData = imageData.data;
        let heightData = [];

        for (let i = 0; i < pixelData.length; i += 4) {
            // RGB elements are combined & the alpha value is skipped
            heightData.push((pixelData[i] + pixelData[i + 1] + pixelData[i + 2]) / 10);
        }
        this.heightData = heightData;
        this.CreateGeometry(this.originX, this.originZ, heightData, terrainTex);
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
        texture.colorSpace = THREE.SRGBColorSpace;

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
        const stride = n + 1;
        const half = this.size / 2;

        // World -> grid coordinates (0...n)
        const u = ((x - (this.originX - half)) / this.size) * n;
        const v = ((z - (this.originZ - half)) / this.size) * n;

        // Outside the terrain
        if (u < 0 || v < 0 || u > n || v > n) return 0;

        const col = Math.min(Math.floor(u), n - 1);
        const row = Math.min(Math.floor(v), n - 1);
        // 0..1 within the cell
        const fx = u - col;
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

    public getBounds(margin: number = 0) {
        const half = this.size / 2;
        return {
            minX: this.originX - half + margin,
            maxX: this.originX + half - margin,
            minZ: this.originZ - half + margin,
            maxZ: this.originZ + half - margin,
        };
    }

}
