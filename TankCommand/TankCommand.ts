
import cloader = require("colladaloader");
import THREE = require("three");
import Terrain = require("Terrain");

class TankCommand {

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.Camera;

    m_terrain;
    //WIDTH: number = 800;
    //HEIGHT: number = 600;
    //menuBackground: HTMLImageElement;
    //private m_ctrl: Controls = new Controls();

    constructor() {

        // Not required .. tricks the transpiler !
        var dummy = cloader;

        var loader = new THREE.ColladaLoader();
        loader.options.convertUpAxis = true;

        // Load tank model & add it to the scene
        //loader.load('models/Tiger.dae', this.ColCallBack(=>any));

        //loader.load('models/Tiger.dae', function (collada) {
        //    this.m_tank = collada.scene;
        //    var skin = collada.skins[0];
        //    this.m_tank.position.set(0, 11, 15);//-15

        //    //console.log();
        //    //camera.position.y = 100;
        //    this.camera.position.z = 100 + this.m_tank.position.z;//320;

        //    this.m_tank.scale.set(0.025, 0.025, 0.025);
        //    this.scene.add(this.m_tank);


        //    //var gridXZ = new THREE.GridHelper(100, 10);
        //    //gridXZ.setColors(new THREE.Color(0x8f8f8f), new THREE.Color(0x8f8f8f));
        //    //gridXZ.position.set(0, 0, 0);
        //    //scene.add(gridXZ);

        //    //});
        //}, /*onProgress, onError*/);

        this.scene = new THREE.Scene();
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(WIDTH, HEIGHT);
        document.body.appendChild(this.renderer.domElement);
        document.body.style.overflow = "hidden";

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 700;
        this.camera.position.y = 100;
        this.scene.add(this.camera);


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

        var heightMap: HTMLImageElement =  <HTMLImageElement>document.getElementById("hmap");
        var terrainTex: HTMLImageElement = <HTMLImageElement>document.getElementById("volc");

        this.m_terrain = new Terrain(heightMap, terrainTex, this.scene);
    }

    private ColCallBack(collada) {
            //this.m_tank = collada.scene;
            var skin = collada.skins[0];
            //this.m_tank.position.set(0, 11, 15);//-15
    }


    public Run(): void {
        this.Initialize();
    }

    private Initialize(): void {

        this.AddHitListener(this.canvas);
        setInterval(() => this.Draw(10), 10);
    }


    AddHitListener(element: HTMLElement) {
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
            //var WIDTH = window.innerWidth,
            //    HEIGHT = window.innerHeight;
            //this.renderer.setSize(WIDTH, HEIGHT);
            //this.camera.aspect = WIDTH / HEIGHT;
            //this.camera.updateProjectionMatrix();
        });
    }


    onResizeScreen(event) {
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;
        this.renderer.setSize(WIDTH, HEIGHT);
        //this.camera.aspect = WIDTH / HEIGHT;
        //this.camera.updateProjectionMatrix();
    }


    onKeyPress(event: KeyboardEvent) {
        event.preventDefault();
        this.onKeyboardPress(event, false);
    }

    onKeyUp(event: KeyboardEvent) {
        event.preventDefault();
        this.onKeyboardRelease(event, false);
    }

    onKeyboardPress(event: Event, touchDevice: boolean) {
        switch (((<number>(<KeyboardEvent>event).keyCode | 0))) {
            case 17:
                //if (!this.fired) {
                //    this.m_ctrl.fire = true;
                //    this.fired = true;
                //}
                break;
            case 37:
                //this.m_ctrl.left = true;
                break;
            case 38:
                //this.m_ctrl.up = true;
                break;
            case 39:
                //this.m_ctrl.right = true;
                break;
            case 40:
                //this.m_ctrl.down = true;
                break;
        }
    }

    onKeyboardRelease(event: Event, touchDevice: boolean) {
        switch (((<number>(<KeyboardEvent>event).keyCode | 0))) {
            case 17:
                //this.m_ctrl.fire = false;
                //this.fired = false;
                break;
            case 37:
                //this.m_ctrl.left = false;
                break;
            case 38:
                //this.m_ctrl.up = false;
                break;
            case 39:
                //this.m_ctrl.right = false;
                break;
            case 40:
                //this.m_ctrl.down = false;
                break;
            default:
                //this.m_ctrl.fire = false;
                break;
        }
    }

    Update(): void {

        this.Draw(10);
    }

    Draw(gameTime: number): void {

        //requestAnimationFrame(this.Draw);
        //mesh.rotation.x += 0.01;
        //mesh.rotation.y += 0.02;

        this.renderer.render(this.scene, this.camera);
    }
}

export = TankCommand;