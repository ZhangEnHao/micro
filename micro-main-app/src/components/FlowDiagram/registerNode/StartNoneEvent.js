export default function StartNoneEvent(lf) {
  lf.register("StartNoneEvent", ({ CircleNode, CircleNodeModel, h }) => {
    class Node extends CircleNode {
      getIconShape() {
        const { x, y, width, height } = this.getAttributes();

        const stroke = "#f88c2d";
        return h(
          "svg",
          {
            x: x - width / 2,
            y: y - height / 2,
            width: 42,
            height: 42,
            viewBox: "0 0 1024 1024"
          },
          h("path", {
            fill: stroke,
            d:
              "M512 15.058824c274.070588 0 496.941176 222.870588 496.941176 496.941176S786.070588 1008.941176 512 1008.941176 15.058824 786.070588 15.058824 512 237.929412 15.058824 512 15.058824m0-15.058824C228.894118 0 0 228.894118 0 512s228.894118 512 512 512 512-228.894118 512-512S795.105882 0 512 0z"
          }),
          h("path", {
            fill: stroke,
            d: "M725.835294 490.917647l-301.17647-227.388235v456.282353z"
          })
        );
      }
      getShape() {
        const attributes = this.getAttributes();
        const { x, y, r, strokeWidth } = attributes;
        return h("g", {}, [
          h("circle", {
            cx: x,
            cy: y,
            r,
            fill: "#fcf1e9",
            stroke: "#f88c2d",
            strokeWidth
          }),
          this.getIconShape()
        ]);
      }
    }
    class Model extends CircleNodeModel {
      constructor(data, graphModel) {
        data.text = {
          value: (data.text && data.text.value) || "",
          x: data.x,
          y: data.y + 35,
          dragable: false,
          editable: false
        };
        super(data, graphModel);
      }
      getConnectedTargetRules() {
        const rules = super.getConnectedTargetRules();
        const notAsTarget = {
          message: "起始节点不能作为连线的终点",
          validate: () => false
        };
        rules.push(notAsTarget);
        return rules;
      }
      setAttributes() {
        const size = 42;
        // 设置自定义锚点
        // 只需要为每个锚点设置相对于节点中心的偏移量
        this.anchorsOffset = [
          [0, size / 2],
          [size / 2, 0],
          [0, -size / 2]
        ];
      }
    }
    return {
      view: Node,
      model: Model
    };
  });
}
