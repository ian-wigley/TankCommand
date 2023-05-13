﻿import * as THREE from 'three'

export class Terrain {

    private m_scene: THREE.Scene;
    private geometry!: THREE.PlaneGeometry;

    //https://github.com/felixpalmer/lod-terrain/blob/master/js/app/terrain.js
    //http://stackoverflow.com/questions/28188775/generate-texture-from-array-in-threejs
    //http://threejs.org/docs/#Reference/Textures/DataTexture
    //http://www.lab4games.net/zz85/blog/2014/11/08/exploring-simple-noise-and-clouds-with-three-js/
    //https://github.com/mrdoob/three.js/issues/758
    //http://www.smartjava.org/content/threejs-render-real-world-terrain-heightmap-using-open-data
    //http://stackoverflow.com/questions/21232332/my-javascript-code-doesnt-work-outside-of-jsfiddle/21277768#21277768
    //http://stackoverflow.com/questions/16449445/how-can-i-set-image-source-with-base64

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

        this.CreateGeometry(-50, -10, heightData, terrainTex);
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
        //attributes.position.array
        let vertices = this.geometry.attributes.position;
        for (let i = 0; i < vertices.array.length; i++) {
            let height = heightData[i]
            vertices.setY(i, height);
        }

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

        //Calculate which cell we are in
        let indexBase: number = 0;
        const _terrainStartX = 0;
        const _terrainStartZ = 0;
        const _spacing = 10;
        const _gridSize = 256;
        const _numCellCols = 255;
        const _numCellRows = 255;

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
