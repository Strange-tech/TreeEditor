import * as THREE from "three";
/*************************************************************************************
 * CLASS NAME:  CustomizeTree
 * DESCRIPTION: 整合各种treeObj
 * NOTE:
 *
 *************************************************************************************/
class CustomizeTree {
  constructor() {
    this.indices = new Map([
      ["普通乔木", 0],
      ["桂花", 1],
      ["国槐", 2],
      ["木芙蓉", 3],
      ["八棱海棠", 4],
      ["红枫", 5],
      ["桃树", 6],
      ["垂丝海棠", 7],
      ["丁香", 8],
      ["凤凰木", 9],
      // ["海棠", 10],
      // ["红果冬青", 11],
    ]);
    this.content = [
      {
        name: "普通乔木",
        path: "resources/images/ordinarytree/",
        depth: 2,
        disturb: 0.02,
        gravity: 1,
        shrink: { single: 0.4, multi: 0.4, root: true },
        tubular_segments: 10,
        radial_segments: 6,
        sample_offset: 0.005,
        leaf: {
          geometry: { style: "cross", width: 0.7, height: 1 },
          scale: 3,
          alphaTest: 0.3,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, 0, 0),
            end: new THREE.Vector3(0, 17, 0),
            radius: 0.6,
            fork: [
              // [ fork_position, noise1, fork_angle, noise2, next_level_length, noise3, number ]
              [0.4, 0.1, Math.PI / 2.5, Math.PI / 36, 7, 0.5, 6],
              [0.5, 0.05, Math.PI / 3, 0, 7, 0.5, 3],
              [0.6, 0.05, Math.PI / 5, 0, 6, 0.5, 3],
              [0.7, 0.05, Math.PI / 6, 0, 5, 0.5, 3],
              [0.95, 0, 0, 0, 4, 0.5, 1],
            ],
          },
          // middle node
          {
            fork: [
              [0.7, 0.1, Math.PI / 4, Math.PI / 36, 3, 0.5, 3],
              [0.9, 0, 0, 0, 3, 0.5, 1],
            ],
          },
          // leaf node
          {
            leaves: [
              // [ leaves_position, noise1, leaves_angle, noise2, number]
              [0.6, 0.35, Math.PI / 3, 0, 6],
              [0.95, 0, 0, 0, 1],
            ],
          },
        ],
      },
      {
        name: "桂花",
        path: "resources/images/guihua/",
        depth: 4,
        disturb: 0.02,
        gravity: 0,
        shrink: { single: 0.4, multi: 0.5, root: true },
        tubular_segments: 5,
        radial_segments: 6,
        sample_offset: 0.01,
        leaf: {
          geometry: { style: "cross", width: 1, height: 1 },
          scale: 0.8,
          alphaTest: 0.5,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, 0, 0),
            end: new THREE.Vector3(0, 8, 0),
            radius: 0.3,
            fork: [[0.6, 0.3, Math.PI / 5, Math.PI / 36, 4, 0.5, 5]],
          },
          // middle node
          {
            fork: [[0.5, 0.4, Math.PI / 6, 0, 3, 0.5, 5]],
          },
          {
            fork: [[0.5, 0.4, Math.PI / 6, 0, 2, 0.5, 2]],
          },
          {
            fork: [[0.5, 0.4, Math.PI / 6, 0, 1, 0.5, 3]],
          },
          // leaf node
          {
            leaves: [[0.8, 0.2, Math.PI / 6, 0, 5]],
          },
        ],
      },
      {
        name: "国槐",
        path: "resources/images/guohuai/",
        depth: 5,
        disturb: 0.03,
        gravity: 3,
        shrink: { single: 0.4, multi: 0.45, root: true },
        tubular_segments: 5,
        radial_segments: 6,
        sample_offset: 0.01,
        leaf: {
          geometry: { style: "cross", width: 0.5, height: 1, foldDegree: 0.3 },
          scale: 0.6,
          alphaTest: 0.5,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, 0, 0),
            end: new THREE.Vector3(0, 15, 0),
            radius: 0.7,
            fork: [
              [0.5, 0.1, Math.PI / 3, Math.PI / 36, 7, 0.5, 5],
              [0.8, 0.1, Math.PI / 4, Math.PI / 36, 6, 0.5, 3],
              [0.95, 0, 0, 0, 5, 0.5, 1],
            ],
          },
          // middle node
          {
            fork: [
              [0.6, 0.2, Math.PI / 5, Math.PI / 36, 3, 0.5, 3],
              [0.95, 0, 0, 0, 3, 0.5, 1],
            ],
          },
          {
            fork: [[0.6, 0.2, Math.PI / 5, Math.PI / 36, 2, 0.5, 3]],
          },
          {
            fork: [[0.6, 0.3, Math.PI / 5, Math.PI / 36, 1, 0.5, 3]],
          },
          {
            fork: [
              [0.5, 0.4, Math.PI / 5, Math.PI / 36, 2, 0, 3],
              [0.95, 0, 0, 0, 2, 0, 1],
            ],
          },
          // leaf node
          {
            leaves: [[0.6, 0.4, Math.PI / 5, 0, 8]],
          },
        ],
      },
      {
        name: "木芙蓉",
        path: "resources/images/mufurong/",
        depth: 4,
        disturb: 0.03,
        gravity: 10,
        shrink: { single: 0.2, multi: 0.45, root: false },
        tubular_segments: 10,
        radial_segments: 4,
        sample_offset: 0,
        leaf: {
          geometry: { style: "surround", width: 1, height: 1 },
          scale: 0.15,
          alphaTest: 0.5,
        },
        flower: {
          scale: 0.08,
          alphaTest: 0.5,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, -0.1, 0),
            end: new THREE.Vector3(0, 0, 0),
            radius: 0.3,
            fork: [[0.7, 0.1, Math.PI / 11, Math.PI / 36, 3, 0.5, 4]],
          },
          // middle node
          {
            fork: [[0.7, 0.2, Math.PI / 6, Math.PI / 36, 2, 0.5, 3]],
          },
          {
            fork: [[0.7, 0.2, Math.PI / 6, Math.PI / 36, 1, 0.5, 3]],
          },
          {
            fork: [[0.7, 0.2, Math.PI / 6, Math.PI / 36, 0.8, 0.2, 3]],
          },
          // leaf node
          {
            leaves: [[0.7, 0.3, Math.PI / 3, 0, 3]],
          },
        ],
      },
      {
        name: "八棱海棠",
        path: "resources/images/8leng/",
        depth: 3,
        disturb: 0.05,
        gravity: -3,
        shrink: { single: 0.2, multi: 0.3, root: false },
        tubular_segments: 10,
        radial_segments: 4,
        sample_offset: 0.005,
        leaf: {
          geometry: { style: "folded", width: 0.5, height: 1 },
          scale: 0.2,
          alphaTest: 0.5,
        },
        flower: {
          scale: 0.08,
          alphaTest: 0.5,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, 0, 0),
            end: new THREE.Vector3(0, 7, 0),
            radius: 0.25,
            fork: [
              [0.3, 0.1, Math.PI / 3, 0, 4.5, 0, 6],
              [0.4, 0.1, Math.PI / 4, 0, 4, 0, 4],
              [0.6, 0.1, Math.PI / 5, 0, 2, 0, 4],
              [0.85, 0, 0, 0, 1, 0.5, 1],
            ],
          },
          // middle node
          {
            fork: [
              [0.4, 0.2, Math.PI / 5, 0, 2, 0.5, 3],
              [0.7, 0.2, Math.PI / 5, 0, 2, 0.5, 2],
              [0.9, 0, 0, 0, 1, 0.5, 1],
            ],
          },
          {
            fork: [
              [0.5, 0.2, Math.PI / 6, 0, 1, 0, 3],
              [0.9, 0, 0, 0, 0.7, 0, 1],
            ],
          },
          // leaf node
          {
            leaves: [[0.7, 0.3, Math.PI / 3, 0, 15]],
            flowers: [[0.9, 0, 0, 0, 1]],
          },
        ],
      },
      {
        name: "红枫",
        path: "resources/images/hongfeng/",
        depth: 3,
        disturb: 0.02,
        gravity: -2,
        shrink: { single: 0.2, multi: 0.35, root: true },
        tubular_segments: 10,
        radial_segments: 4,
        sample_offset: 0.005,
        leaf: {
          geometry: { style: "folded", width: 1, height: 1 },
          scale: 0.4,
          alphaTest: 0.5,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, 0, 0),
            end: new THREE.Vector3(0, 9, 0),
            radius: 0.25,
            fork: [
              [0.3, 0.1, Math.PI / 3, 0, 4.5, 0, 6],
              [0.4, 0.1, Math.PI / 4, 0, 4, 0, 4],
              [0.6, 0.1, Math.PI / 5, 0, 2, 0, 4],
              [0.8, 0, 0, 0, 1, 0, 1],
            ],
          },
          // middle node
          {
            fork: [
              [0.4, 0.2, Math.PI / 5, 0, 2, 0.5, 3],
              [0.7, 0.2, Math.PI / 5, 0, 2, 0.5, 2],
              [0.9, 0, 0, 0, 1, 0.5, 1],
            ],
          },
          {
            fork: [
              [0.5, 0.2, Math.PI / 6, 0, 1, 0, 3],
              [0.9, 0, 0, 0, 0.7, 0, 1],
            ],
          },
          // leaf node
          {
            leaves: [[0.7, 0.3, Math.PI / 3, 0, 10]],
          },
        ],
      },
      {
        name: "桃树",
        path: "resources/images/peach/",
        depth: 3,
        disturb: 0.02,
        gravity: -3,
        shrink: { single: 0.2, multi: 0.3, root: false },
        tubular_segments: 10,
        radial_segments: 4,
        sample_offset: 0.005,
        leaf: {
          geometry: { style: "folded", width: 0.5, height: 1 },
          scale: 0.2,
          alphaTest: 0.5,
        },
        flower: {
          scale: 0.08,
          alphaTest: 0.5,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, 0, 0),
            end: new THREE.Vector3(0, 7, 0),
            radius: 0.25,
            fork: [
              [0.3, 0.1, Math.PI / 3, 0, 4.5, 0, 6],
              [0.4, 0.1, Math.PI / 4, 0, 4, 0, 4],
              [0.6, 0.1, Math.PI / 5, 0, 2, 0, 4],
              [0.85, 0, 0, 0, 1, 0.5, 1],
            ],
          },
          // middle node
          {
            fork: [
              [0.4, 0.2, Math.PI / 5, 0, 2, 0.5, 3],
              [0.7, 0.2, Math.PI / 5, 0, 2, 0.5, 2],
              [0.9, 0, 0, 0, 1, 0.5, 1],
            ],
          },
          {
            fork: [
              [0.5, 0.2, Math.PI / 6, 0, 1, 0, 3],
              [0.9, 0, 0, 0, 0.7, 0, 1],
            ],
          },
          // leaf node
          {
            leaves: [[0.7, 0.3, Math.PI / 3, 0, 15]],
            flowers: [[0.9, 0, 0, 0, 1]],
          },
        ],
      },
      {
        name: "垂丝海棠",
        path: "resources/images/chuisi/",
        depth: 3,
        disturb: 0.05,
        gravity: -3,
        shrink: { single: 0.2, multi: 0.3, root: false },
        tubular_segments: 10,
        radial_segments: 4,
        sample_offset: 0.005,
        leaf: {
          geometry: { style: "folded", width: 0.5, height: 1 },
          scale: 0.2,
          alphaTest: 0.5,
        },
        flower: {
          scale: 0.08,
          alphaTest: 0.5,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, 0, 0),
            end: new THREE.Vector3(0, 8, 0),
            radius: 0.25,
            fork: [
              [0.3, 0, Math.PI / 3, 0, 4.5, 0, 6],
              [0.4, 0.1, Math.PI / 4, 0, 4, 0, 4],
              [0.6, 0.1, Math.PI / 5, 0, 2, 0, 4],
              [0.85, 0, 0, 0, 1, 0.5, 1],
            ],
          },
          // middle node
          {
            fork: [
              [0.4, 0.2, Math.PI / 5, 0, 2, 0.5, 3],
              [0.7, 0.2, Math.PI / 5, 0, 2, 0.5, 2],
              [0.9, 0, 0, 0, 1, 0.5, 1],
            ],
          },
          {
            fork: [
              [0.5, 0.2, Math.PI / 6, 0, 1, 0, 3],
              [0.9, 0, 0, 0, 0.7, 0, 1],
            ],
          },
          // leaf node
          {
            leaves: [[0.7, 0.3, Math.PI / 3, 0, 15]],
            flowers: [[0.9, 0, 0, 0, 1]],
          },
        ],
      },
      {
        name: "丁香",
        path: "resources/images/dingxiang/",
        depth: 4,
        disturb: 0.03,
        gravity: 5,
        shrink: { single: 0.2, multi: 0.45, root: false },
        tubular_segments: 10,
        radial_segments: 4,
        sample_offset: 0.007,
        leaf: {
          geometry: { style: "folded", width: 0.5, height: 1 },
          scale: 0.2,
          alphaTest: 0.5,
        },
        flower: {
          scale: 0.07,
          alphaTest: 0.5,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, -0.1, 0),
            end: new THREE.Vector3(0, 0, 0),
            radius: 0.3,
            fork: [[0.7, 0.1, Math.PI / 11, Math.PI / 36, 5, 0.5, 3]],
          },
          // middle node
          {
            fork: [
              [0.4, 0.2, Math.PI / 5, Math.PI / 36, 2, 0.5, 3],
              [0.7, 0.2, Math.PI / 5, Math.PI / 36, 2, 0.5, 3],
            ],
          },
          {
            fork: [[0.7, 0.2, Math.PI / 6, Math.PI / 36, 1, 0.5, 3]],
          },
          {
            fork: [[0.7, 0.2, Math.PI / 6, Math.PI / 36, 0.8, 0.2, 5]],
          },
          // leaf node
          {
            leaves: [[0.7, 0.3, Math.PI / 3, 0, 10]],
            flowers: [[0.9, 0.1, Math.PI / 3, 0, 5]],
          },
        ],
      },
      {
        name: "凤凰木",
        path: "resources/images/fenghuangmu/",
        depth: 3,
        disturb: 0.05,
        gravity: -2,
        shrink: { single: 0.2, multi: 0.35, root: true },
        tubular_segments: 10,
        radial_segments: 4,
        sample_offset: 0.005,
        leaf: {
          geometry: { style: "folded_reverse", width: 1, height: 1 },
          scale: 0.3,
          alphaTest: 0.5,
        },
        flower: {
          scale: 0.15,
          alphaTest: 0.5,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, 0, 0),
            end: new THREE.Vector3(0, 9, 0),
            radius: 0.25,
            fork: [
              [0.3, 0.1, Math.PI / 3, 0, 4.5, 0, 6],
              [0.4, 0.1, Math.PI / 4, 0, 4, 0, 4],
              [0.6, 0.1, Math.PI / 5, 0, 2, 0, 4],
              [0.8, 0, 0, 0, 1, 0.5, 1],
            ],
          },
          // middle node
          {
            fork: [
              [0.4, 0.2, Math.PI / 5, 0, 2, 0.5, 3],
              [0.7, 0.2, Math.PI / 5, 0, 2, 0.5, 2],
              [0.9, 0, 0, 0, 1, 0.5, 1],
            ],
          },
          {
            fork: [
              [0.5, 0.2, Math.PI / 6, 0, 1, 0, 3],
              [0.9, 0, 0, 0, 0.7, 0, 1],
            ],
          },
          // leaf node
          {
            leaves: [[0.7, 0.3, Math.PI / 3, 0, 5]],
            flowers: [[0.8, 0.2, Math.PI / 3, 0, 3]],
          },
        ],
      },
      // {
      //   name: "海棠",
      //   path: "resources/images/haitang/",
      //   depth: 3,
      //   disturb: 0.03,
      //   gravity: 3,
      //   shrink: { single: 0.2, multi: 0.35, root: true },
      //   tubular_segments: 10,
      //   radial_segments: 4,
      //   sample_offset: 0.005,
      //   leaf: {
      //     geometry: { style: "folded", width: 0.5, height: 1 },
      //     scale: 0.3,
      //     alphaTest: 0.5,
      //   },
      //   flower: {
      //     scale: 0.1,
      //     alphaTest: 0.5,
      //   },
      //   branches: [
      //     // root node
      //     {
      //       start: new THREE.Vector3(0, 0, 0),
      //       end: new THREE.Vector3(0, 10, 0),
      //       radius: 0.25,
      //       fork: [
      //         [0.4, 0.05, Math.PI / 3, 0, 4.5, 0, 6],
      //         [0.5, 0.1, Math.PI / 4, 0, 4, 0, 4],
      //         [0.6, 0.1, Math.PI / 5, 0, 2, 0, 4],
      //         [0.8, 0, 0, 0, 1, 0.5, 1],
      //       ],
      //     },
      //     // middle node
      //     {
      //       fork: [
      //         [0.4, 0.2, Math.PI / 5, 0, 2, 0.5, 3],
      //         [0.7, 0.2, Math.PI / 5, 0, 2, 0.5, 2],
      //         [0.9, 0, 0, 0, 1, 0.5, 1],
      //       ],
      //     },
      //     {
      //       fork: [
      //         [0.5, 0.2, Math.PI / 6, 0, 1, 0, 3],
      //         [0.9, 0, 0, 0, 0.7, 0, 1],
      //       ],
      //     },
      //     // leaf node
      //     {
      //       leaves: [[0.7, 0.3, Math.PI / 3, 0, 8]],
      //       flowers: [[0.8, 0.2, Math.PI / 3, 0, 3]],
      //     },
      //   ],
      // },
      // {
      //   name: "红果冬青",
      //   path: "resources/images/hongguo/",
      //   depth: 3,
      //   disturb: 0.05,
      //   gravity: 3,
      //   shrink: { single: 0.5, multi: 0.4, root: true },
      //   tubular_segments: 10,
      //   radial_segments: 5,
      //   sample_offset: 0.005,
      //   leaf: {
      //     geometry: { style: "folded", width: 0.3, height: 1 },
      //     scale: 0.3,
      //     alphaTest: 0.5,
      //   },
      //   fruit: {
      //     geometry: { style: "cross", width: 0.5, height: 1 },
      //     scale: 0.15,
      //     alphaTest: 0.5,
      //   },
      //   branches: [
      //     // root node
      //     {
      //       start: new THREE.Vector3(0, 0, 0),
      //       end: new THREE.Vector3(0, 3, 0),
      //       radius: 0.2,
      //       fork: [[0.95, 0, Math.PI / 5, Math.PI / 36, 3, 0.5, 2]],
      //     },
      //     // middle node
      //     {
      //       fork: [
      //         [0.4, 0.2, Math.PI / 3, 0, 2, 0.5, 6],
      //         [0.7, 0.2, Math.PI / 3, 0, 2, 0.5, 4],
      //         [0.9, 0, 0, 0, 1, 0.5, 1],
      //       ],
      //     },
      //     {
      //       fork: [
      //         [0.5, 0.2, Math.PI / 4, 0, 1, 0, 4],
      //         [0.9, 0, 0, 0, 0.7, 0, 1],
      //       ],
      //     },
      //     // leaf node
      //     {
      //       leaves: [[0.7, 0.3, Math.PI / 3, 0, 10]],
      //       flowers: [[0.8, 0.2, Math.PI / 3, 0, 3]],
      //     },
      //   ],
      // },
    ];
  }

  getTree(name) {
    const { indices, content } = this;
    const id = indices.get(name);
    return content[id];
  }
}

export { CustomizeTree };
