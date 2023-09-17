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
import { Octree } from "../lib/Octree";
import { GUIController } from "../lib/GUIController";
import { toSeePoint } from "../utilities";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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
  const far = 5000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 200, 200);
  camera.lookAt(0, 0, 0);
  // const camerahelper = new THREE.CameraHelper(camera);
  // scene.add(camerahelper);
  // const another_camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // another_camera.position.set(400, 400, 0);
  // another_camera.lookAt(0, 0, 0);

  // const controls = new OrbitControls(camera, renderer.domElement);
  const controls = new MapControls(camera, renderer.domElement);
  controls.minDistance = 100;
  controls.maxDistance = 3000;
  // controls.enableDamping = true;

  const guiController = new GUIController(camera);

  const amLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(amLight);

  const csm = new CSM({
    maxFar: 1000,
    cascades: 3,
    mode: "practical",
    parent: scene,
    shadowMapSize: 512,
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
      color: 0xb3b3b3,
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

  const planeSize = 15000;
  const vertexNumber = 1500;

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

  const boundary = terrain.getBoundingBox();

  const species = Array.from(customizeTree.indices.keys());
  species.forEach((name, index) => {
    let treeObj = customizeTree.getTree(name);
    let details = 原神启动(treebuilder, treeObj, 400, 2000);
    let instancedlod = new InstancedLOD(scene, camera, treeObj.name);
    let octree = new Octree(boundary, 5, 0);
    instancedlod.setOctree(octree);
    let total = 100000;
    if (index === 0) total = 150000;
    else if (index === 2) total = 50000;
    instancedlod.setLevels(details);
    instancedlod.setPopulation(total);
    let cnt = 0;
    // let range = new THREE.Box3();
    while (cnt < total) {
      // let found;
      let x, y, z;
      idx_x = 3 * Math.floor(Math.random() * l);
      x = vertices.array[idx_x];
      y = vertices.array[idx_x + 1];
      z = vertices.array[idx_x + 2];
      // do {
      //   found = [];
      //   idx_x = 3 * Math.floor(Math.random() * l);
      //   x = vertices.array[idx_x];
      //   y = vertices.array[idx_x + 1];
      //   z = vertices.array[idx_x + 2];
      //   range.min.set(
      //     x - range_box_size,
      //     y - range_box_size,
      //     z - range_box_size
      //   );
      //   range.max.set(
      //     x + range_box_size,
      //     y + range_box_size,
      //     z + range_box_size
      //   );
      //   octree.queryByBox(range, found);
      //   console.log("query");
      // } while (found.length > 0);

      size = Math.random() + 0.5;
      scale.set(size, size, size);
      position.set(x, y, z);
      // octree.insert(new THREE.Matrix4().makeTranslation(x, y, z));
      quaterion.setFromAxisAngle(y_axis, Math.random() * Math.PI * 2);
      octree.insert(new THREE.Matrix4().compose(position, quaterion, scale));
      cnt++;
    }
    // console.log(octree);
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
  csm.setupMaterial(terrain.planeMaterial);
  const terrainMesh = terrain.getMesh();
  terrainMesh.castShadow = true;
  terrainMesh.receiveShadow = true;
  scene.add(terrainMesh);

  //-----------------------------------------------------------------------------
  // GRASS

  //-----------------------------------------------------------------------------
  // WANDERER
  const keypoints = [
    new THREE.Vector3(1000, 1000, 0),
    new THREE.Vector3(1000, 200, 0),
    new THREE.Vector3(400, 200, 0),
  ];
  const curve = new THREE.CatmullRomCurve3(keypoints);
  const points = curve.getPoints(500);
  let cnt = 0;

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
    // if (cnt < points.length) camera.position.copy(points[cnt++]);
    controls.update();
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
  animate();
}

main();
