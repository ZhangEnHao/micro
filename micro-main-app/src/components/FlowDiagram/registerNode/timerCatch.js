export default function timerCatch(lf) {
  lf.register("timerCatch", ({ PolygonNode, PolygonNodeModel }) => {
    class TimerCatchNode extends PolygonNode {}
    class TimerCatchModel extends PolygonNodeModel {
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
      setAttributes() {
        this.points = [
          [0, 0],
          [58, 0],
          [29, 40]
        ];
        this.fill = "#fcf1e9";
        this.stroke = "#f88c2d";
      }
    }
    return {
      view: TimerCatchNode,
      model: TimerCatchModel
    };
  });
}
