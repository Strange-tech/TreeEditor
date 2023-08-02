import * as THREE from "three";
// import WebGPU from "three/examples/jsm/capabilities/WebGPU.js";
// import WebGPURenderer from "three/examples/jsm/renderers/webgpu/WebGPURenderer.js";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import { CSM } from "three/examples/jsm/csm/CSM.js";
import { CSMHelper } from "three/examples/jsm/csm/CSMHelper.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { TreeBuilder } from "../TreeBuilder";
import { CustomizeTree } from "../CustomizeTree";
import { InstancedLOD } from "../lib/InstancedLOD";
import { LeafGeometry } from "../leaf_flower_fruit/LeafGeometry";
import { Terrain } from "../lib/Terrain";
import { QuadTree, Rectangle, Point } from "../lib/Quadtree";
import { GUIController } from "../lib/GUIController";

function main() {
  // if (WebGPU.isAvailable() === false) {
  //   document.body.appendChild(WebGPU.getErrorMessage());
  //   throw new Error("No WebGPU support");
  // }
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();

  const fov = 45;
  const aspect = 2;
  const near = 0.1;
  const far = 10000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(100, 70, 0);
  camera.up.set(0, 1, 0);

  const controls = new MapControls(camera, renderer.domElement);
  // controls.enableDamping = true;

  const guiController = new GUIController(camera, controls);

  const amLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(amLight);

  const csm = new CSM({
    maxFar: 500,
    cascades: 3,
    mode: "practical",
    parent: scene,
    shadowMapSize: 256,
    lightDirection: new THREE.Vector3(-1, -1, -1).normalize(),
    lightColor: new THREE.Color(0x000020),
    lightIntensity: 0.5,
    camera: camera,
  });

  const textureLoader = new THREE.TextureLoader();

  function 原神启动(treebuilder, treeObj, dist0, dist1) {
    treebuilder.clearMesh();
    treebuilder.init(treeObj);
    let lod0 = treebuilder.buildTree(treebuilder.buildSkeleton());
    let texture = textureLoader.load(`${treeObj.path}texture.png`);
    let box = new THREE.Box3().setFromObject(lod0);
    let boxSize = box.getSize(new THREE.Vector3());
    let size = Math.max(...boxSize.toArray());

    let geometry = new LeafGeometry("cross", 1, 1)
      .generate()
      .scale(size, size, size);
    let material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      color: 0xcdcdcd,
      // transparent: true,
      alphaTest: 0.9,
    });
    let lod1 = new THREE.Mesh(geometry, material);

    let details = [
      {
        group: lod0,
        level: "l0",
        distance: dist0,
      },
      {
        group: new THREE.Group().add(lod1),
        level: "l1",
        distance: dist1,
      },
    ];
    return details;
  }

  const planeSize = 5000;
  const vertexNumber = 500;

  // const axesHelper = new THREE.AxesHelper(1000);
  // scene.add(axesHelper);
  const terrain = new Terrain(planeSize, planeSize, vertexNumber, vertexNumber);
  const vertices = terrain.setImprovedNoise(0.3);

  const customizeTree = new CustomizeTree();
  const treebuilder = new TreeBuilder();

  const instancedLODs = [];
  let l = vertices.array.length / 3;
  const y_axis = new THREE.Vector3(0, 1, 0);
  let position = new THREE.Vector3();
  let quaterion = new THREE.Quaternion();
  let scale = new THREE.Vector3();
  let idx_x, size;

  const boundary = new Rectangle(0, 0, planeSize / 2, planeSize / 2);
  const quadtree = new QuadTree(boundary, 10);
  const r = 5;

  customizeTree.content.forEach((treeObj, index) => {
    let details = 原神启动(treebuilder, treeObj, 300, 2000);
    let instancedlod = new InstancedLOD(scene, camera, treeObj.name);
    let total = 10000;
    if (index === 0) total = 15000;
    else if (index === 2) total = 5000;
    instancedlod.setLevels(details);
    instancedlod.setPopulation(total);
    let cnt = 0;
    while (cnt < total) {
      let found;
      do {
        found = [];
        idx_x = 3 * Math.floor(Math.random() * l);
        let range = new Rectangle(
          vertices.array[idx_x], // x
          vertices.array[idx_x + 2], // z
          r,
          r
        );
        quadtree.query(range, found);
        console.log("query");
      } while (found.length > 0);
      let x = vertices.array[idx_x],
        y = vertices.array[idx_x + 1],
        z = vertices.array[idx_x + 2];
      quadtree.insert(new Point(x, z, r));
      size = Math.random() + 0.5;
      position.set(x, y, z);
      quaterion.setFromAxisAngle(y_axis, Math.random() * Math.PI * 2);
      scale.set(size, size, size);
      instancedlod.setTransform(
        cnt,
        new THREE.Matrix4().compose(position, quaterion, scale)
      );
      cnt++;
    }
    instancedLODs.push(instancedlod);
  });

  //-----------------------------------------------------------------------------
  // SKY BOX
  {
    const skyboxLoader = new THREE.CubeTextureLoader();
    const skyboxTexture = skyboxLoader.load([
      "resources/images/sky box/right.jpg",
      "resources/images/sky box/left.jpg",
      "resources/images/sky box/top.jpg",
      "resources/images/sky box/bottom.jpg",
      "resources/images/sky box/front.jpg",
      "resources/images/sky box/back.jpg",
    ]);
    scene.background = skyboxTexture;
  }

  //-----------------------------------------------------------------------------
  // TERRAIN
  terrain.loadTexture(
    "resources/images/terrain/terrain_base.png",
    "resources/images/terrain/terrain_normal.png"
  );
  csm.setupMaterial(terrain.getMaterial());
  const terrainMesh = terrain.getMesh();
  terrainMesh.castShadow = true;
  terrainMesh.receiveShadow = true;
  scene.add(terrainMesh);

  //-----------------------------------------------------------------------------
  // GRASS

  //-----------------------------------------------------------------------------
  // WANDERER
  const points = [
    new THREE.Vector3(1800, 800, 0),
    new THREE.Vector3(1000, 300, 0),
    new THREE.Vector3(-400, 70, 0),
    new THREE.Vector3(-800, 70, 0),
  ];

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixelRatio) | 0;
    const height = (canvas.clientHeight * pixelRatio) | 0;
    // const width = canvas.clientWidth | 0;
    // const height = canvas.clientHeight | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {
    // 图像不随屏幕拉伸改变
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    // controls.update();
    instancedLODs.forEach((instance) => {
      instance.render();
    });
    csm.update();
    renderer.render(scene, camera);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }
  // animate();

  function renderForWander() {
    guiController.moveCamera();
    render();
    let id = requestAnimationFrame(renderForWander);
    if (guiController.reachWanderEnd()) {
      cancelAnimationFrame(id);
      // controls.update();
      animate();
    }
  }

  guiController.setWander(points, 1500, 1400);
  renderForWander();
}

main();
