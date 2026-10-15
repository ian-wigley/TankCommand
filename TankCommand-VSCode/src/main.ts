import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js';
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js';
import { InputControls } from './Input'
import { Terrain } from './Terrain';

class TankCommand {

      private renderer!: THREE.WebGLRenderer;
      private scene!: THREE.Scene;
      private m_camera!: THREE.PerspectiveCamera;
      private m_terrain!: Terrain;
      private m_ctrl: InputControls = new InputControls();

      private m_tank!: THREE.Group;
      private m_clock = new THREE.Clock();

      private m_arrowHelper!: THREE.ArrowHelper;
      private m_cameraArrowHelper!: THREE.ArrowHelper;
      private bbHelper!: THREE.BoxHelper;
      private stats: any;
      private m_angle: number = 0;
      private currentPosition: THREE.Vector3;
      private currentLookat: THREE.Vector3;
      private readonly tankHeightOffset = 0; // tweak so the tracks sit on the surface

      constructor() {
            this.currentPosition = new THREE.Vector3();
            this.currentLookat = new THREE.Vector3();
      }

      public init(): void {
            let _this = this;

            let loader = new ColladaLoader();
            // loader.options.convertUpAxis = true;

            // Load tank model & add it to the scene
            loader.load("./models/Tiger.dae", function (collada: any) {

                  const model = collada.scene;
                  model.scale.set(0.5, 0.5, 0.5);

                  _this.m_tank = new THREE.Group();
                  _this.m_tank.add(model);
                  _this.m_tank.position.set(0, 11, 15);
                  _this.scene.add(_this.m_tank);

                  // Start the camera at its ideal spot rather than swooping in from (0,0,0)
                  _this.currentPosition.copy(_this.calculateIdealOffet());
                  _this.currentLookat.copy(_this.calculateIdealLookAt());

                  _this.bbHelper = new THREE.BoxHelper(_this.m_tank, 0xff0000);
                  _this.bbHelper.update();
                  // If you want a visible bounding box
                  _this.scene.add(_this.bbHelper);

                  _this.m_camera.position.z = 150 + _this.m_tank.position.z;

                  const dir = new THREE.Vector3(0, 0, -1);
                  //normalize the direction vector (convert to vector of length 1)
                  dir.normalize();
                  const origin = new THREE.Vector3(_this.m_tank.position.x, _this.m_tank.position.y + 30, _this.m_tank.position.z);
                  const length = 10;
                  const hex = 0xffff00;
                  _this.m_arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
                  _this.scene.add(_this.m_arrowHelper);

                  const camOrigin = new THREE.Vector3(_this.m_tank.position.x, _this.m_tank.position.y + 30, _this.m_tank.position.z + 30);
                  const camHex = 0xff0000;
                  _this.m_cameraArrowHelper = new THREE.ArrowHelper(dir, camOrigin, length, camHex);
                  _this.scene.add(_this.m_cameraArrowHelper);

                  console.log("Model loading complete");

            }, this.onProgress, this.onError);

            this.scene = new THREE.Scene();
            let width = window.innerWidth;
            let height = window.innerHeight;
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setSize(width, height);
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

            // const vertexShader = document.getElementById('vertexShader').textContent;
            // if (!vertexShader) {
            //   throw new Error("getElementById('vertexShader')");
            // }
            // const fragmentShader = document.getElementById('fragmentShader').textContent;
            // if (!fragmentShader) {
            //   throw new Error("getElementById('vertexShader')");
            // }

            // let uniforms = {
            //   topColor: { type: "c", value: new THREE.Color(0x000000) },
            //   bottomColor: { type: "c", value: new THREE.Color(0x262626) },
            //   offset: { type: "f", value: 100 },
            //   exponent: { type: "f", value: 0.7 }
            // }
            /*
                var skyGeo = new THREE.SphereGeometry(2000, 32, 15);
                var skyMat = new THREE.ShaderMaterial({ vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide });
                var sky = new THREE.Mesh(skyGeo, skyMat);
                scene.add(sky);
            */
            let light = new THREE.PointLight(0xfffff3, 0.8);
            light.position.set(-100, 200, 100);
            this.scene.add(light);

            let sphereSize = 1;
            let pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
            this.scene.add(pointLightHelper);

            let light2 = new THREE.PointLight(0xd7f0ff, 0.2);
            light2.position.set(200, 200, 100);
            this.scene.add(light2);

            let pointLightHelper2 = new THREE.PointLightHelper(light2, sphereSize);
            this.scene.add(pointLightHelper2);

            let light3 = new THREE.PointLight(0xFFFFFF, 0.5);
            light3.position.set(150, 200, -100);
            this.scene.add(light3);

            let pointLightHelper3 = new THREE.PointLightHelper(light3, sphereSize);
            this.scene.add(pointLightHelper3);

            let heightMap: HTMLImageElement = <HTMLImageElement>document.getElementById("hmap");
            let terrainTex: HTMLImageElement = <HTMLImageElement>document.getElementById("volc");

            this.m_terrain = new Terrain(this.scene);
            this.m_terrain.initialise(heightMap, terrainTex);

            this.addHitListener();//this.canvas);
      }

      private onProgress(): void {
            console.log("Loading model");
      }

      private onError(): void {
            console.log("Error Loading model");
      }

      public run(): void {
            this.update();
      }

      private addHitListener(): void {
            window.addEventListener("keydown", (event) => {
                  this.onKeyPress(event);
                  return null;
            });

            window.addEventListener("keyup", (event) => {
                  this.onKeyUp(event);
                  return null;
            });

            window.addEventListener('resize', (event) => {
                  console.log(event);
                  this.onResizeScreen();
            });
      }

      private onResizeScreen(): void {
            let WIDTH = window.innerWidth;
            let HEIGHT = window.innerHeight;
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
            console.log(touchDevice);
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
                        if (this.m_tank.position.z > -1199.5 && this.m_tank.position.z < 1200.5) {
                              this.m_ctrl.up = true;
                        }
                        break;
                  case 39:
                        this.m_ctrl.right = true;
                        break;
                  case 40:
                        if (this.m_tank.position.z > -1199.5 && this.m_tank.position.z < 1200.5) {
                              this.m_ctrl.down = true;
                        }
                        break;
            }
      }

      private onKeyboardRelease(event: Event, touchDevice: boolean) {
            console.log(touchDevice);
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
                  // let height = this.m_terrain.getHeight(this.m_tank.position.x, this.m_tank.position.z);
                  this.updateTank();
                  this.bbHelper.update();
                  this.updateCamera();
                  this.draw();
            }
            requestAnimationFrame(this.update.bind(this));
      }


      private updateTank(): void {
            const turnSpeed = 0.05;
            const moveSpeed = 1;

            if (this.m_ctrl.left) { this.m_angle += turnSpeed; }
            if (this.m_ctrl.right) { this.m_angle -= turnSpeed; }
            this.m_tank.rotation.y = this.m_angle;   // single source of truth for heading

            const forward = new THREE.Vector3(-Math.sin(this.m_angle), 0, -Math.cos(this.m_angle));
            if (this.m_ctrl.up) { this.m_tank.position.addScaledVector(forward, moveSpeed); }
            if (this.m_ctrl.down) { this.m_tank.position.addScaledVector(forward, -moveSpeed); }

            // Stay on the terrain (from the previous step)
            const groundY = this.m_terrain.getHeight(this.m_tank.position.x, this.m_tank.position.z);
            this.m_tank.position.y = groundY + this.tankHeightOffset;

            this.m_arrowHelper.setDirection(forward);
            this.m_cameraArrowHelper.setDirection(forward);
            this.m_arrowHelper.position.set(this.m_tank.position.x, this.m_tank.position.y + 30, this.m_tank.position.z);
            this.m_cameraArrowHelper.position.set(this.m_tank.position.x - 10, this.m_tank.position.y + 30, this.m_tank.position.z - 10);
            // document.getElementById("cameraPositionX").innerHTML = this.m_tank.position.x.toString();
            // document.getElementById("cameraPositionY").innerHTML = this.m_tank.position.y.toString();
            // document.getElementById("cameraPositionZ").innerHTML = this.m_tank.position.z.toString();
      }

      private updateCamera(): void {
            const idealOffset = this.calculateIdealOffet();
            const idealLookAt = this.calculateIdealLookAt();

            const dt = this.m_clock.getDelta();
            const t = 1.0 - Math.pow(0.001, dt);

            this.currentPosition.lerp(idealOffset, t);
            this.currentLookat.lerp(idealLookAt, t);

            this.m_camera.position.copy(this.currentPosition);
            this.m_camera.lookAt(this.currentLookat);
      }

      private calculateIdealOffet(): THREE.Vector3 {
            const idealOffset = new THREE.Vector3(-15, 20, 30);
            idealOffset.applyQuaternion(this.m_tank.quaternion);
            idealOffset.add(this.m_tank.position);
            return idealOffset;
      }

      private calculateIdealLookAt(): THREE.Vector3 {
            const idealLookat = new THREE.Vector3(0, 10, -50);
            idealLookat.applyQuaternion(this.m_tank.quaternion);
            idealLookat.add(this.m_tank.position);
            return idealLookat;
      }

      private draw(): void {
            if (this.m_arrowHelper != undefined && this.m_tank !== undefined) {
                  this.stats.update();
                  this.renderer.render(this.scene, this.m_camera);
            }
      }
}

let application = new TankCommand();
application.init();
application.run();
