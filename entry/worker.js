import { bikMeans } from "../lib/Cluster";
import { TreeBuilder } from "../TreeBuilder";
import { CustomizeTree } from "../CustomizeTree";

const customizeTrees = new CustomizeTree();
const treeObj = customizeTrees.getTree("法国梧桐");
const builder = new TreeBuilder(treeObj, true, "z-axis");

self.addEventListener(
  "message",
  (event) => {
    const clusters = event.data.input;
    const skeletons = [];
    console.time("kmeans skeleton timer");
    clusters.forEach((cluster) => {
      skeletons.push(builder.buildKmeansSkeleton(cluster, 32));
    });
    console.timeEnd("kmeans skeleton timer");

    self.postMessage(skeletons);

    // console.log("finish computing!");
  },
  false
);
