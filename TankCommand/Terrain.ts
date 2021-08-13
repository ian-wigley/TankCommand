import THREE = require("three");

class Terrain {

    m_scene: THREE.Scene;
    worldWidth: number = 1024;
    levels: number = 6;
    resolution: number = 128;
    terrainTex;
    heightData = [];

    //https://github.com/felixpalmer/lod-terrain/blob/master/js/app/terrain.js
    //http://stackoverflow.com/questions/28188775/generate-texture-from-array-in-threejs
    //http://threejs.org/docs/#Reference/Textures/DataTexture
    //http://www.lab4games.net/zz85/blog/2014/11/08/exploring-simple-noise-and-clouds-with-three-js/
    //https://github.com/mrdoob/three.js/issues/758
    //http://www.smartjava.org/content/threejs-render-real-world-terrain-heightmap-using-open-data
    //http://stackoverflow.com/questions/21232332/my-javascript-code-doesnt-work-outside-of-jsfiddle/21277768#21277768		
    //http://stackoverflow.com/questions/16449445/how-can-i-set-image-source-with-base64

    constructor(heightMap, terrainTex, scene: THREE.Scene) {
        this.m_scene = scene;

        var gridXZ = new THREE.GridHelper(100, 10, new THREE.Color(0x8f8f8f), new THREE.Color(0x8f8f8f));
        gridXZ.position.set(0, 0, 0);
        scene.add(gridXZ);

        this.BuildMesh(heightMap, terrainTex, scene);
    }


    private BuildMesh(heightMap, terrainTex, scene) {

        // Get the data from the texture
        var imagedata = this.GetImageData(heightMap);
        var pixelData = imagedata.data;
        var heightData = [];

        for (var i = 0; i < pixelData.length; i += 4) {
            // RGB elements are combined & the alpha value is skipped
            heightData.push((pixelData[i] + pixelData[i + 1] + pixelData[i + 2]) / 10);
        }

        this.CreateTiles(-50, -10, heightData, scene, terrainTex);
    }


    // Function to Create a Tile that represents the heightmap
    private CreateTiles(x, z, heightData, scene, terrainTex) {

        // Number of Segments = heightmap width/height -1
        var numSegments = 255;

        // Create a plane PlaneGeometry(width, height, widthSegments, heightSegments)
        var geometry = new THREE.PlaneGeometry(2400, 2400, numSegments, numSegments);

        geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(x, 0, z));

        geometry.name = "Terrain";

        // Iterate through the plane & adjust the height values accordingly
        for (var i = 0; i < geometry.vertices.length; i++) {

            geometry.vertices[i].y += heightData[i];
        }

        var texture = new THREE.CanvasTexture(terrainTex);
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));
        scene.add(mesh);

        // // // New Arrow Helper
        // // var dir = new THREE.Vector3(0, 0, 1);
        // // var origin = new THREE.Vector3(0, 0, 0);
        // // var length = 150;
        // // var hex = 0xffff00;
        // // var arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
        // // scene.add(arrowHelper);

        // // //axes
        // // var axes = new THREE.AxisHelper(100);
        // // scene.add(axes);
    }


    // Function to extract the data from the Image
    private GetImageData(image) {

        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, image.width, image.height);
    }
}

export = Terrain;