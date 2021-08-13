///<reference path="./stats.d.ts"/>
///<reference path="./ammo.d.ts"/>

import cloader = require("colladaloader");
import THREE = require("three");
import Terrain = require("Terrain");
import Input = require("Input");

class TankCommand {

    private canvas: HTMLCanvasElement;
//    private ctx: CanvasRenderingContext2D;
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private m_camera: THREE.PerspectiveCamera;
    private m_terrain: Terrain;
    private m_ctrl: Input = new Input();
    private m_tank: THREE.Mesh;
    private m_arrowHelper: THREE.ArrowHelper;
    private stats;
    private m_angle: number = 0;
    private m_sceneWidth;
    private m_sceneHeight;

    constructor() { }

    public init(): void {

        var _this = this;

        // Not required .. tricks the transpiler !
        var dummy = cloader;

        var loader = new THREE.ColladaLoader();
        loader.options.convertUpAxis = true;

        // Load tank model & add it to the scene
        loader.load("./models/Tiger.jpg", function (collada) {
            var t = collada.scene;
            _this.m_tank = collada.scene;
            var skin = collada.skins[0];
            _this.m_tank.position.set(0, 11, 15);
            _this.scene.add(_this.m_tank);

            _this.m_camera.position.z = 150 + _this.m_tank.position.z;

            var gridXZ = new THREE.GridHelper(100, 10, new THREE.Color(0x8f8f8f), new THREE.Color(0x8f8f8f));
            gridXZ.position.set(0, 0, 0);
            _this.scene.add(gridXZ);

            const dir = new THREE.Vector3(0, 0, -1);
            //normalize the direction vector (convert to vector of length 1)
            dir.normalize();
            const origin = new THREE.Vector3(_this.m_tank.position.x, _this.m_tank.position.y + 30, _this.m_tank.position.z);
            const length = 10;
            const hex = 0xffff00;
            _this.m_arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
            _this.scene.add(_this.m_arrowHelper);

            console.log("Model loading complete");

         }, this.onProgress, this.onError);

        this.scene = new THREE.Scene();
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(WIDTH, HEIGHT);
        document.body.appendChild(this.renderer.domElement);
        document.body.style.overflow = "hidden";


        // STATS
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        document.body.appendChild(this.stats.domElement);

        this.m_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        this.m_camera.position.z = 700;
        this.m_camera.position.y = 100;
        this.scene.add(this.m_camera);

        var vertexShader = document.getElementById('vertexShader').textContent;
        var fragmentShader = document.getElementById('fragmentShader').textContent;
        var uniforms = {
            topColor: { type: "c", value: new THREE.Color(0x000000) },
            bottomColor: { type: "c", value: new THREE.Color(0x262626) },
            offset: { type: "f", value: 100 },
            exponent: { type: "f", value: 0.7 }
        }
        /*
            var skyGeo = new THREE.SphereGeometry(2000, 32, 15);
            var skyMat = new THREE.ShaderMaterial({ vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide });
            var sky = new THREE.Mesh(skyGeo, skyMat);
            scene.add(sky);
        */
        var light = new THREE.PointLight(0xfffff3, 0.8);
        light.position.set(-100, 200, 100);
        this.scene.add(light);

        var sphereSize = 1;
        var pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
        this.scene.add(pointLightHelper);

        var light2 = new THREE.PointLight(0xd7f0ff, 0.2);
        light2.position.set(200, 200, 100);
        this.scene.add(light2);

        var sphereSize = 1;
        var pointLightHelper2 = new THREE.PointLightHelper(light2, sphereSize);
        this.scene.add(pointLightHelper2);

        var light3 = new THREE.PointLight(0xFFFFFF, 0.5);
        light3.position.set(150, 200, -100);
        this.scene.add(light3);

        var sphereSize = 1;
        var pointLightHelper3 = new THREE.PointLightHelper(light3, sphereSize);
        this.scene.add(pointLightHelper3);

        var heightMap: HTMLImageElement = <HTMLImageElement>document.getElementById("hmap");
        var terrainTex: HTMLImageElement = <HTMLImageElement>document.getElementById("volc");

        this.m_terrain = new Terrain(heightMap, terrainTex, this.scene);

        this.addHitListener(this.canvas);
    }

    private onProgress() {
         console.log("Loading model");
    }

    private onError() {
        console.log("Error Loading model");
    }

    private ColCallBack(collada) {
        var skin = collada.skins[0];
    }

    public run(): void {
        this.update();
    }

    private addHitListener(element: HTMLElement) {
        window.addEventListener("keydown", (event) => {
            this.onKeyPress(event);
            return null;
        });

        window.addEventListener("keyup", (event) => {
            this.onKeyUp(event);
            return null;
        });

        window.addEventListener('resize', (event) => {
            this.onResizeScreen(event);
        });
    }


    public onResizeScreen(event) {
        var WIDTH = window.innerWidth;
        var HEIGHT = window.innerHeight;
        this.renderer.setSize(WIDTH, HEIGHT);
        this.m_camera.aspect = WIDTH / HEIGHT;
        this.m_camera.updateProjectionMatrix();
    }

    private onKeyPress(event: KeyboardEvent) {
        event.preventDefault();
        this.onKeyboardPress(event, false);
    }

    private onKeyUp(event: KeyboardEvent) {
        event.preventDefault();
        this.onKeyboardRelease(event, false);
    }

    private onKeyboardPress(event: Event, touchDevice: boolean) {
        switch (((<number>(<KeyboardEvent>event).keyCode | 0))) {
            case 17:
                //if (!this.fired) {
                //    this.m_ctrl.fire = true;
                //    this.fired = true;
                //}
                break;
            case 37:
                this.m_ctrl.left = true;
                break;
            case 38:
                this.m_ctrl.up = true;
                break;
            case 39:
                this.m_ctrl.right = true;
                break;
            case 40:
                this.m_ctrl.down = true;
                break;
        }
    }

    private onKeyboardRelease(event: Event, touchDevice: boolean) {
        switch (((<number>(<KeyboardEvent>event).keyCode | 0))) {
            case 17:
                //this.m_ctrl.fire = false;
                //this.fired = false;
                break;
            case 37:
                this.m_ctrl.left = false;
                break;
            case 38:
                this.m_ctrl.up = false;
                break;
            case 39:
                this.m_ctrl.right = false;
                break;
            case 40:
                this.m_ctrl.down = false;
                break;
            default:
                this.m_ctrl.fire = false;
                break;
        }
    }

    private update(): void {

        if (this.m_arrowHelper != undefined && this.m_tank !== undefined) {
            if (this.m_ctrl.up) {
                this.m_tank.position.z -= 0.5;
                this.m_camera.position.z -= 0.5;
                var newVector = new THREE.Vector3(-Math.sin(this.m_angle), 0, -Math.cos(this.m_angle)).normalize();
                this.m_tank.position.add(newVector);
                this.m_camera.position.add(newVector);
            }
            if (this.m_ctrl.down) {
                this.m_tank.position.z += 0.5;
                this.m_camera.position.z += 0.5;
                var newVector = new THREE.Vector3(Math.sin(this.m_angle), 0, Math.cos(this.m_angle)).normalize();
                this.m_tank.position.add(newVector);
                this.m_camera.position.add(newVector);
            }
            if (this.m_ctrl.left) {
                this.m_tank.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.1);
                this.m_camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.1);
                this.m_angle += 0.1;
                var newVector = new THREE.Vector3(-Math.sin(this.m_angle), 0, -Math.cos(this.m_angle)).normalize();
                this.m_arrowHelper.setDirection(newVector);
            }
            if (this.m_ctrl.right) {
                this.m_tank.rotateOnAxis(new THREE.Vector3(0, 1, 0), -0.1);
                this.m_camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), -0.1);
                this.m_angle -= 0.1;
                var newVector = new THREE.Vector3(-Math.sin(this.m_angle), 0, -Math.cos(this.m_angle)).normalize();
                this.m_arrowHelper.setDirection(newVector);
            }

            this.m_arrowHelper.position.set(this.m_tank.position.x, this.m_tank.position.y + 30, this.m_tank.position.z);
        }

        this.draw();
        requestAnimationFrame(this.update.bind(this));
    }

    public draw(): void {
        if (this.m_arrowHelper != undefined && this.m_tank !== undefined) {
            this.stats.update();
            this.renderer.render(this.scene, this.m_camera);
        }
    }
}

export = TankCommand;