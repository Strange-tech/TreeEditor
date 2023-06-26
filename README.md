# Tree Editor

## 操作栏

模式（MODE）包括：

1. 视图（view）：支持鼠标拖动视角查看但不可编辑场景
2. 清空（delete all）：删除场景中全部元素
3. 编辑（edit）：支持用不同编辑方式在场景中放置树木
   - 放置单一树木（place a tree）：点击一个位置，在此位置放置一棵树木
   - 划线生成一排树木（draw a line）：点击若干关键点，以此生成一条曲线，在曲线上放置一排树木
   - 圈定范围生成树木（delineate an area）：点击若干边界点，生成封闭凸包区域，在区域内放置大范围树木

树木种类（TREE）包括：

1. 普通乔木（Ordinary tree）
2. 国槐（Chinese huai）
3. 桂花（Gui flower）
4. 木芙蓉（Mu furong）
5. 香樟（Sweet zhang）

生成器（GENERATOR）包括：

1. 树木大小（size）：在原始树木大小的基础上扩大几倍
2. 大小浮动值（size volatility）：在 size 的基础上的大小浮动范围
3. 随机朝向（random orientation）：是否启用随机化朝向
4. 启用实例化（mesh instanced）：是否启用实例化，建议启用

## 放置单一树木

MODE/edit/place a tree -> 移动鼠标在平面点击一个点 -> 选择树木种类（如 TREE/Ordinary tree）-> 调整树木大小，浮动值，朝向等（非必选）-> GENERATOR/generate

## 划线一排树木

MODE/edit/draw a line -> 选择 sample number 的值 -> 选择曲线是否封闭 -> 移动鼠标在平面点击至少两个点 -> 选择树木种类（如 TREE/Ordinary tree）-> 调整树木大小，浮动值，朝向等（非必选）-> GENERATOR/generate

## 圈定范围树木

MODE/edit/delineate an area -> 选择 total number 的值 -> 移动鼠标在平面点击至少三个点 -> 选择树木种类（如 TREE/Ordinary tree）-> 调整树木大小，浮动值，朝向等（非必选）-> GENERATOR/generate
