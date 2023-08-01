import * as THREE from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import { CSM } from "three/examples/jsm/csm/CSM.js";
import { CSMHelper } from "three/examples/jsm/csm/CSMHelper.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { TreeBuilder } from "../TreeBuilder";
import { getTrees } from "../AxiosApi";
import { CustomizeTree } from "../CustomizeTree";
import { InstancedLOD } from "../lib/InstancedLOD";
import { LeafGeometry } from "../leaf_flower_fruit/LeafGeometry";
import { Terrain } from "../lib/Terrain";

function main() {
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

  const amLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(amLight);

  const csm = new CSM({
    maxFar: 500,
    cascades: 3,
    mode: "practical",
    parent: scene,
    shadowMapSize: 1024,
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
      color: 0xb8b8b8,
      // transparent: true,
      alphaTest: 0.5,
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
  customizeTree.content.forEach((treeObj, index) => {
    let details = 原神启动(treebuilder, treeObj, 300, 2000);
    let instancedlod = new InstancedLOD(scene, camera, treeObj.name);
    let total = 10000;
    if (index === 0) total = 15000;
    else if (index === 2) total = 5000;
    instancedlod.setLevels(details);
    instancedlod.setPopulation(total);
    for (let i = 0; i < total; i++) {
      let idx_x = 3 * Math.floor(Math.random() * l);
      let x = vertices.array[idx_x],
        y = vertices.array[idx_x + 1],
        z = vertices.array[idx_x + 2];
      instancedlod.setTransform(
        i,
        new THREE.Matrix4().makeTranslation(x, y, z)
      );
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
  terrain.loadTexture("resources/images/terrain/terrain_base.png");
  csm.setupMaterial(terrain.getMaterial());
  const terrainMesh = terrain.getMesh();
  terrainMesh.castShadow = true;
  terrainMesh.receiveShadow = true;
  scene.add(terrainMesh);

  //-----------------------------------------------------------------------------
  // GRASS

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
  animate();
}

main();
