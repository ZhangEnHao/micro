export default function timerStart(lf) {
  lf.register("timerStart", ({ CircleNode, CircleNodeModel, h }) => {
    class TimerStartNode extends CircleNode {
      getIconShape() {
        const attributes = this.getAttributes();

        const { x, y, width, height } = attributes;
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
              "M212.992 526.336 212.992 526.336 212.992 526.336 215.04 526.336 212.992 526.336Z"
          }),
          h("path", {
            fill: stroke,
            d:
              "M724.992 296.96 724.992 296.96 296.96 296.96 296.96 724.992 724.992 724.992 724.992 296.96Z"
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
    class TimerStartModel extends CircleNodeModel {
      constructor(data, graphModel) {
        data.text = {
          value: (data.text && data.text.value) || "",
          x: data.x,
          y: data.y + 35,
          dragable: false,
          editable: true
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
    }
    return {
      view: TimerStartNode,
      model: TimerStartModel
    };
  });
}
