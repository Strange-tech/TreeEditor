import * as THREE from "three";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";

/*************************************************************************************
 * CLASS NAME:  Terrain
 * DESCRIPTION: Generate terrain with rise and fall
 * NOTE:
 *
 *************************************************************************************/
class Terrain {
  constructor(length, width, lengthVertex, widthVertex) {
    this.length = length;
    this.width = width;
    this.lengthVertex = lengthVertex;
    this.widthVertex = widthVertex;
    this.quality = 1; // improved Perlin noise's quality, default is 1

    this.planeGeometry = new THREE.PlaneGeometry(
      length,
      width,
      lengthVertex - 1,
      widthVertex - 1
    );
    this.planeGeometry.rotateX(-Math.PI / 2);

    this.planeMaterial; // default material

    this.vertices = {
      length: lengthVertex,
      width: widthVertex,
      array: this.planeGeometry.attributes.position.array, // array of 3 * lengthVertex * widthVertex
    };
  }

  setImprovedNoise(quality) {
    this.quality = quality;

    const { lengthVertex, widthVertex, vertices } = this;
    const size = lengthVertex * widthVertex;
    const perlin = new ImprovedNoise();
    const data = new Uint8Array(size);

    let z = Math.random() * 100;
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < size; i++) {
        let x = i % widthVertex;
        let y = ~~(i / widthVertex);
        data[i] += Math.abs(
          perlin.noise(x / quality, y / quality, z) * quality * 1.75
        );
      }
      quality *= 5;
    }

    for (let i = 0, j = 0, l = vertices.array.length; i < l; i++, j += 3) {
      vertices.array[j + 1] = data[i] * 2;
    }

    return vertices;
  }

  loadTexture(url) {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(url);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    const repeatsInlength = 32;
    const repeatsInwidth = 32;
    texture.repeat.set(repeatsInlength, repeatsInwidth);
    this.planeMaterial = new THREE.MeshPhongMaterial({
      map: texture,
    });
  }

  getMaterial() {
    return this.planeMaterial;
  }

  getMesh() {
    return new THREE.Mesh(this.planeGeometry, this.planeMaterial);
  }
}

export { Terrain };
