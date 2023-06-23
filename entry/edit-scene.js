import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { TreeBuilder } from "../TreeBuilder";
import { CustomizeTree } from "../CustomizeTree";

const main = () => {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });
  // renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(0xffffff, 1.0);

  /* 基本场景 */
  const scene = new THREE.Scene();

  const fov = 45;
  const aspect = 2;
  const near = 0.1;
  const far = 5000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(500, 500, 500);
  camera.lookAt(0, 10, 0);

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
    const dirlight = new THREE.DirectionalLight(color, intensity);
    dirlight.position.set(0, 100, 0);
    scene.add(dirlight);
  }

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 10, 0);
  controls.update();

  const size = 1000;
  const segment = 100;
  const unit = size / segment;
  const circle_radius = 5;

  scene.add(new THREE.AxesHelper(size));

  const gridHelper = new THREE.GridHelper(size, segment);
  scene.add(gridHelper);

  const geometry = new THREE.PlaneGeometry(size, size);
  geometry.rotateX(-Math.PI / 2);

  const plane = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ visible: false })
  );
  scene.add(plane);

  /* 系统全局变量 */
  const customizeTree = new CustomizeTree();
  let treeObj = customizeTree.getTree("普通乔木"); // default species
  const builder = new TreeBuilder(treeObj, true);

  const raycaster = new THREE.Raycaster();
  let pointer = new THREE.Vector2();
  let points = [];
  let cells = [];
  let timer, interval_timer, isDaubing;
  const cellgeo = new THREE.SphereGeometry(unit);
  const cellmat = new THREE.MeshBasicMaterial({
    color: "red",
    transparent: true,
    opacity: 0.5,
  });
  const cellmesh = new THREE.Mesh(cellgeo, cellmat);
  const pointergeo = new THREE.CircleGeometry(circle_radius, 32);
  pointergeo.rotateX(Math.PI / 2);
  const pointermat = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
  });
  const circle = new THREE.Mesh(pointergeo, pointermat);
  const curve = new THREE.CatmullRomCurve3();
  const curvegeo = new THREE.BufferGeometry();
  const curvemat = new THREE.LineBasicMaterial({ color: "brown" });
  const curvemesh = new THREE.Line(curvegeo, curvemat);

  const assistance_group = new THREE.Group(); // 存储辅助模型
  const treegroup = new THREE.Group(); // 存储当前场景的模型
  let current_mode = "view"; // ["view", "edit"]
  let current_edit_way = "place_a_tree"; // ["place_a_tree", "draw_a_line", "spread_an_area", "delineate_an_area"]
  let place_statement = "placing"; // ["placing", "placed"]
  let current_tree = "ordinary_tree";

  scene.add(assistance_group);
  scene.add(treegroup);

  /* 系统函数 */
  const buildInstancedMeshGroup = function (singleTree, matrices) {
    const instancedMeshGroup = new THREE.Group();
    const instancedMeshes = [];
    // singleTree is a THREE.Group
    singleTree.children.forEach((child) => {
      instancedMeshes.push(
        new THREE.InstancedMesh(child.geometry, child.material, matrices.length)
      );
    });
    matrices.forEach((matrix, index) => {
      instancedMeshes.forEach((instancedMesh) => {
        instancedMesh.setMatrixAt(index, matrix);
      });
    });
    instancedMeshGroup.add(...instancedMeshes);
    return instancedMeshGroup;
  };

  const intersecting = (event, object) => {
    pointer.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(object, false);
    if (intersects.length > 0) return intersects[0].point.setY(0);
    return;
  };

  const onMouseMove = (event) => {
    // console on screen
    console.log("mouse move");
    if (current_mode === "edit") {
      if (
        (current_edit_way === "place_a_tree" &&
          place_statement === "placing") ||
        current_edit_way === "draw_a_line"
      ) {
        // update UI
        move_the_ball(event);
      } else if (current_edit_way === "spread_an_area") {
        // update UI
        show_mouse_circle(event); // to be completed
      }
    }

    function move_the_ball(event) {
      let point = intersecting(event, plane);
      cellmesh.material.opacity = 0.5;
      if (point) cellmesh.position.set(point.x, 0, point.z);
    }
  };

  const onClick = (event) => {
    if (current_mode === "edit") {
      if (current_edit_way === "place_a_tree") {
        place_the_ball(event);
        place_statement = "placed";
      } else if (current_edit_way === "draw_a_line") {
        let point = multiplace_the_ball(event);
        points.push(point);
        curve.points = points;
        if (points.length >= 2)
          curvemesh.geometry.setFromPoints(curve.getPoints(50));
      }
    }

    function place_the_ball(event) {
      let point = intersecting(event, plane);
      if (point) {
        cellmesh.material.opacity = 1;
        cellmesh.position.set(point.x, 0, point.z);
      }
    }

    function multiplace_the_ball(event) {
      let point = intersecting(event, plane);
      if (point) {
        cellmesh.position.set(point.x, 0, point.z);
        assistance_group.add(cellmesh.clone(false));
      }
      return point;
    }
  };

  const onPointerDown = (event) => {
    // console on screen
    console.log("pointer down");

    timer = setTimeout(() => {
      let point = intersecting(event, plane);
      if (point) {
        circle.position.set(point.x, 1, point.z);
        scene.add(circle);
        isDaubing = true;
      }
      console.log("长按开始");
    }, 1000);
  };

  const onPointerUp = (event) => {
    clearTimeout(timer);
    clearInterval(interval_timer);
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    scene.remove(circle);
    isDaubing = false;
    console.log("pointer up");

    // rasterization
    let lastcell = new THREE.Vector3().addScalar(Infinity);
    points.forEach((point) => {
      let cell = point
        .divideScalar(unit)
        .floor()
        .multiplyScalar(unit)
        .addScalar(unit / 2)
        .setY(0);
      if (!lastcell.equals(cell)) cells.push(cell);
      lastcell = cell;
    });

    let skeleton = builder.buildSkeleton();
    let tree = builder.buildTree(skeleton);
    builder.clearMesh();
    const matrices = [];
    cells.forEach((cell) => {
      matrices.push(
        new THREE.Matrix4()
          .makeRotationY(2 * Math.PI * Math.random())
          .setPosition(cell)
      );
    });

    let instancedTree = buildInstancedMeshGroup(tree, matrices);
    treegroup.add(instancedTree);

    cells = [];
    points = [];
    controls.enabled = true;
  };

  const onDoubleClick = (event) => {
    clearTimeout(timer);
    let point = intersecting(event, plane);
    if (point) {
      points.push(point);
      let pointmesh = new THREE.Mesh(pointgeo, pointmat);
      pointmesh.position.set(point.x, box_size / 2, point.z);
      pointgroup.add(pointmesh);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("dblclick", onDoubleClick);

      let curve = new THREE.CatmullRomCurve3(points);
      let curvepoints = curve.getPoints(100);
      let linemat = new THREE.LineBasicMaterial({
        color: 0x0000ff,
      });
      let linegeo = new THREE.BufferGeometry().setFromPoints(curvepoints);
      let line = new THREE.Line(linegeo, linemat);
      pointgroup.add(line);

      // rasterization
      let lastcell = new THREE.Vector3().addScalar(Infinity);
      curvepoints.forEach((point) => {
        let cell = point
          .divideScalar(unit)
          .floor()
          .multiplyScalar(unit)
          .addScalar(unit / 2)
          .setY(0);
        if (!lastcell.equals(cell)) cells.push(cell);
        lastcell = cell;
      });

      cells.forEach((cell) => {
        let skeleton = builder.buildSkeleton();
        let tree = builder.buildTree(skeleton);
        builder.clearMesh();
        tree.position.copy(cell);
        treegroup.add(tree);
      });

      cells = [];
      points = [];
      controls.enabled = true;
    }
  };

  function swtich_mode_to_view() {
    current_mode = "view";
    assistance_group.clear();
    cellmesh.material.opacity = 0.5;
    points = [];
    curve.points = [];
    controls.enabled = true;
  }

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

  /////////////////////////////////////////////////////////////////////////////////
  // GUI
  const listeners = new Map([
    ["mousemove", onMouseMove],
    ["click", onClick],
  ]);
  listeners.forEach((listener, eventname) => {
    canvas.addEventListener(eventname, listener);
  });
  const guiobj = {
    "sample number": 0,
    "is closed": false,
    "place a tree": function () {
      assistance_group.add(cellmesh);
      current_mode = "edit";
      current_edit_way = "place_a_tree";
      place_statement = "placing";
      controls.enabled = false;
    },
    "draw a line": function () {
      assistance_group.add(cellmesh);
      assistance_group.add(curvemesh);
      current_mode = "edit";
      current_edit_way = "draw_a_line";
      place_statement = "placing";
      controls.enabled = false;
    },
    "spread an area": function () {},
    "delineate an area": function () {},
    view: function () {
      swtich_mode_to_view();
    },
    "delete all": function () {
      scene.remove(treegroup);
      scene.remove(pointgroup);
    },
    "Ordinary tree": function () {
      treeObj = customizeTree.getTree("普通乔木");
      builder.init(treeObj, true);
    },
    "Chinese huai": function () {
      treeObj = customizeTree.getTree("国槐");
      builder.init(treeObj, true);
    },
    "Gui flower": function () {
      treeObj = customizeTree.getTree("桂花");
      builder.init(treeObj, true);
    },
    "Mu furong": function () {
      treeObj = customizeTree.getTree("红枫");
      builder.init(treeObj, true);
    },
    "Sweet zhang": function () {
      treeObj = customizeTree.getTree("香樟");
      builder.init(treeObj, true);
    },
    generate: function () {
      if (current_mode === "edit") {
        if (current_edit_way === "place_a_tree") {
          let tree = builder.buildTree(builder.buildSkeleton());
          tree.scale.set(5, 5, 5);
          tree.position.copy(cellmesh.position);
          treegroup.add(tree);
        } else if (current_edit_way === "draw_a_line") {
          let sample_points = curve.getPoints(this["sample number"]);
          let tree = builder.buildTree(builder.buildSkeleton());
          sample_points.forEach((sample_point) => {
            let eachtree = tree.clone();
            eachtree.scale.set(5, 5, 5);
            eachtree.position.copy(sample_point);
            treegroup.add(eachtree);
          });
        }
      }
      swtich_mode_to_view();
      builder.clearMesh();
    },
  };
  const gui = new GUI();

  const mode_folder = gui.addFolder("MODE");
  mode_folder.add(guiobj, "view");
  mode_folder.add(guiobj, "delete all");

  const tree_folder = gui.addFolder("TREE");
  tree_folder.add(guiobj, "Ordinary tree");
  tree_folder.add(guiobj, "Chinese huai");
  tree_folder.add(guiobj, "Gui flower");
  tree_folder.add(guiobj, "Mu furong");
  tree_folder.add(guiobj, "Sweet zhang");

  const generate_folder = gui.addFolder("GENERATOR");
  generate_folder.add(guiobj, "generate");

  const edit_folder = mode_folder.addFolder("edit");
  edit_folder.add(guiobj, "place a tree");
  const draw_line_folder = edit_folder.addFolder("draw a line");
  draw_line_folder.add(guiobj, "draw a line"); // 划线
  draw_line_folder.add(guiobj, "sample number", 1, 100, 1);
  draw_line_folder.add(guiobj, "is closed");
  // edit_folder.add(guiobj, "spread an area"); // 涂抹一片区域
  edit_folder.add(guiobj, "delineate an area"); // 圈定一块区域

  function render() {
    // 图像不随屏幕拉伸改变
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }
  animate();
};

main();
