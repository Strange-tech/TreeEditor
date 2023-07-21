import * as THREE from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { TreeBuilder } from "../TreeBuilder";
import { getTrees } from "../AxiosApi";
import { CustomizeTree } from "../CustomizeTree";
import { drawLine, lookAt } from "../utilities";
import { InstancedLOD } from "../lib/InstancedLOD";
import { LeafGeometry } from "../leaf_flower_fruit/LeafGeometry";
import { Terrain } from "../lib/Terrain";

function 原神启动(treebuilder, treeObj, dist0, dist1, scale, textureLoader) {
  treebuilder.clearMesh();
  treebuilder.init(treeObj);
  let lod0 = treebuilder.buildTree(treebuilder.buildSkeleton());

  let texture = textureLoader.load(`${treeObj.path}texture.png`);
  texture.colorSpace = THREE.SRGBColorSpace;
  let geometry = new LeafGeometry("cross", scale, scale).generate();
  let material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
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

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const fov = 45;
  const aspect = 2;
  const near = 0.1;
  const far = 100000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(1000, 1000, 1000);
  camera.up.set(0, 1, 0);

  const controls = new MapControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const color = 0xffffff;
  const intensity = 1.0;
  const amLight = new THREE.AmbientLight(color, intensity);
  scene.add(amLight);

  const planeSize = 10000;
  const vertexNumber = 1000;

  // const axesHelper = new THREE.AxesHelper(1000);
  // scene.add(axesHelper);

  const terrain = new Terrain(
    scene,
    planeSize,
    planeSize,
    vertexNumber,
    vertexNumber
  );
  const vertices = terrain.setImprovedNoise(1);
  terrain.loadTexture("resources/images/terrain.png");
  terrain.addToScene();

  const customizeTree = new CustomizeTree();
  const treebuilder = new TreeBuilder();
  const textureLoader = new THREE.TextureLoader();
  const instancedLODs = [];
  let scales = [27, 14, 27, 6, 10, 10, 10, 10, 8, 10];
  let l = vertices.array.length / 3;
  customizeTree.content.forEach((treeObj, index) => {
    let details = 原神启动(
      treebuilder,
      treeObj,
      900,
      2000,
      scales[index],
      textureLoader
    );
    let instancedlod = new InstancedLOD(scene, camera, treeObj.name);
    let total = 10000;
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

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixelRatio) | 0;
    const height = (canvas.clientHeight * pixelRatio) | 0;
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
    controls.update();
    instancedLODs.forEach((instance) => {
      instance.render();
    });
    renderer.render(scene, camera);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }
  animate();
}

main();
