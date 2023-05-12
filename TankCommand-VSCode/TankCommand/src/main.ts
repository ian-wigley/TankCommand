import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader'
import { InputControls } from './Input'
import { Terrain } from './Terrain';

class TankCommand {

      private canvas!: HTMLCanvasElement;
      private renderer!: THREE.WebGLRenderer;
      private scene!: THREE.Scene;
      private m_camera!: THREE.PerspectiveCamera;
      private m_terrain!: Terrain;
      private m_ctrl: InputControls = new InputControls();
      private m_tank!: THREE.Mesh;
      private m_arrowHelper!: THREE.ArrowHelper;
      private m_cameraArrowHelper!: THREE.ArrowHelper;
      private bbHelper!: THREE.BoxHelper;
      private stats: any;
      private m_angle: number = 0;
      private currentPosition: THREE.Vector3;
      private currentLookat: THREE.Vector3;

      constructor() {
            this.currentPosition = new THREE.Vector3();
            this.currentLookat = new THREE.Vector3();
      }

      public init(): void {
            let _this = this;

            let loader = new ColladaLoader();
            // loader.options.convertUpAxis = true;

            // Load tank model & add it to the scene
            loader.load("./models/Tiger.jpg", function (collada: any) {
                  _this.m_tank = collada.scene;
                  _this.m_tank.position.set(0, 11, 15);
                  _this.m_tank.scale.set(0.5, 0.5, 0.5);
                  _this.scene.add(_this.m_tank);

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
            var width = window.innerWidth;
            var height = window.innerHeight;
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

            this.m_terrain = new Terrain(this.scene);
            this.m_terrain.initialise(heightMap, terrainTex);

            this.addHitListener(this.canvas);
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

      private addHitListener(element: HTMLElement): void {
            window.addEventListener("keydown", (event) => {
                  this.onKeyPress(event);
                  return null;
            });

            window.addEventListener("keyup", (event) => {
                  this.onKeyUp(event);
                  return null;
            });

            window.addEventListener('resize', (event) => {
                  this.onResizeScreen();
            });
      }

      private onResizeScreen(): void {
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
                  let height = this.m_terrain.getHeight(this.m_tank.position.x, this.m_tank.position.z);
                  this.updateTank();
                  this.bbHelper.update();
                  this.updateCamera();
                  this.draw();
            }
            requestAnimationFrame(this.update.bind(this));
      }

      private updateTank(): void {
            if (this.m_ctrl.up) {
                  this.m_tank.position.z -= 0.5;
                  let newVector = new THREE.Vector3(-Math.sin(this.m_angle), 0, -Math.cos(this.m_angle)).normalize();
                  this.m_tank.position.add(newVector);
            }
            if (this.m_ctrl.down) {
                  this.m_tank.position.z += 0.5;
                  let newVector = new THREE.Vector3(Math.sin(this.m_angle), 0, Math.cos(this.m_angle)).normalize();
                  this.m_tank.position.add(newVector);
            }
            if (this.m_ctrl.left) {
                  this.m_tank.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.1);
                  this.m_angle += 0.1;
                  let newVector = new THREE.Vector3(-Math.sin(this.m_angle), 0, -Math.cos(this.m_angle)).normalize();
                  this.m_arrowHelper.setDirection(newVector);
                  this.m_cameraArrowHelper.setDirection(newVector);
            }
            if (this.m_ctrl.right) {
                  this.m_tank.rotateOnAxis(new THREE.Vector3(0, 1, 0), -0.1);
                  this.m_angle -= 0.1;
                  let newVector = new THREE.Vector3(-Math.sin(this.m_angle), 0, -Math.cos(this.m_angle)).normalize();
                  this.m_arrowHelper.setDirection(newVector);
                  this.m_cameraArrowHelper.setDirection(newVector);
            }

            this.m_arrowHelper.position.set(this.m_tank.position.x, this.m_tank.position.y + 30, this.m_tank.position.z);
            this.m_cameraArrowHelper.position.set(this.m_tank.position.x - 10, this.m_tank.position.y + 30, this.m_tank.position.z - 10);

            // document.getElementById("cameraPositionX").innerHTML = this.m_tank.position.x.toString();
            // document.getElementById("cameraPositionY").innerHTML = this.m_tank.position.y.toString();
            // document.getElementById("cameraPositionZ").innerHTML = this.m_tank.position.z.toString();
      }

      private updateCamera(): void {
            const idealOffset = this.calculateIdealOffet();
            const idealLookAt = this.calculateIdealLookAt();

            const t = 1.0 - Math.pow(0.001, 0.01);

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


// // Example from https://sbcode.net/threejs/stats-panel/

// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import Stats from 'three/examples/jsm/libs/stats.module'

// const scene = new THREE.Scene()

// const camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
// )
// camera.position.z = 2

// const renderer = new THREE.WebGLRenderer()
// renderer.setSize(window.innerWidth, window.innerHeight)
// document.body.appendChild(renderer.domElement)

// const controls = new OrbitControls(camera, renderer.domElement)
// //controls.addEventListener('change', render)

// const geometry = new THREE.BoxGeometry()
// const material = new THREE.MeshBasicMaterial({
//       color: 0x00ff00,
//       wireframe: true,
// })

// const cube = new THREE.Mesh(geometry, material)
// scene.add(cube)

// window.addEventListener('resize', onWindowResize, false)
// function onWindowResize() {
//       camera.aspect = window.innerWidth / window.innerHeight
//       camera.updateProjectionMatrix()
//       renderer.setSize(window.innerWidth, window.innerHeight)
//       //render()
// }

// const stats = new Stats()
// document.body.appendChild(stats.dom)

// function animate() {
//       requestAnimationFrame(animate)

//       cube.rotation.x += 0.01
//       cube.rotation.y += 0.01

//       render()

//       stats.update()
// }

// function render() {
//       renderer.render(scene, camera)
// }

// animate()
// //render()

// // import * as THREE from 'three';
// // // import Stats from 'stats.js'
// // import Stats from 'three/examples/jsm/libs/stats.module'

// // const scene = new THREE.Scene();
// // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// // const renderer = new THREE.WebGLRenderer();
// // renderer.setSize(window.innerWidth, window.innerHeight);
// // document.body.appendChild(renderer.domElement);

// // const geometry = new THREE.BoxGeometry(1, 1, 1);
// // const material = new THREE.MeshBasicMaterial({ color: "orange" });
// // const cube = new THREE.Mesh(geometry, material);
// // scene.add(cube);

// // camera.position.z = 3;
// // camera.position.y = -0.5;
// // camera.position.x = -1;

// // // STATS
// // let stats = new Stats();
// // stats.dom.style.position = 'absolute';
// // stats.dom.style.top = '0px';
// // document.body.appendChild(stats.dom);
// // stats.update();

// // renderer.render(scene, camera);

