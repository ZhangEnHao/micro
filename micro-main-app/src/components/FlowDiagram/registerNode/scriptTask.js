export default function scriptTask(lf) {
  lf.register("scriptTask", ({ RectNode, RectNodeModel, h }) => {
    class View extends RectNode {
      getIconShape() {
        const { x, y, width, height } = this.getAttributes();

        const stroke = "#f88c2d";
        return h("g", {}, [
          h(
            "svg",
            {
              fill: stroke,
              x: x - width / 1.4,
              y: y - height / 1.4,
              width: 42,
              height: 42,
              viewBox: "0 0 1274 1024"
            },
            h("path", {
              fill: stroke,
              d:
                "M955.17377 226.622951l162.832787 162.832787h-147.72459c-10.072131 0-18.465574-10.072131-18.465574-18.465574v-144.367213h3.357377z m-186.334426 386.09836c-10.072131 0-18.465574 10.072131-18.465574 18.465574 0 10.072131 10.072131 18.465574 18.465574 18.465574H990.42623c10.072131 0 18.465574-10.072131 18.465573-18.465574 0-10.072131-10.072131-18.465574-18.465573-18.465574H768.839344z m0-90.64918c-10.072131 0-18.465574 10.072131-18.465574 18.465574 0 10.072131 10.072131 18.465574 18.465574 18.465574h110.793443c10.072131 0 18.465574-10.072131 18.465574-18.465574 0-10.072131-10.072131-18.465574-18.465574-18.465574h-110.793443z m350.845902-95.685246v258.518033c0 31.895082-25.180328 53.718033-53.718033 53.718033H735.265574c-31.895082 0-53.718033-25.180328-53.718033-53.718033v-402.885246c0-31.895082 25.180328-53.718033 53.718033-53.718033h182.977049V386.098361c0 25.180328 18.465574 43.645902 43.645902 43.645901h157.796721v-3.357377z"
            })
          )
        ]);
      }
      getShape() {
        const style = this.getShapeStyle();

        const { width, height } = style;
        const { x, y } = this.getAttributes();
        const position = {
          x: x - width / 2,
          y: y - height / 2,
          cx: 0,
          cy: 0,
          rx: 4,
          ry: 4,
          fill: "#fcf1e9",
          stroke: "#f88c2d"
        };

        return h("g", {}, [
          h("rect", {
            ...style,
            ...position
          }),
          this.getIconShape()
        ]);
      }
    }
    class Model extends RectNodeModel {
      constructor(data, graphModel) {
        super(data, graphModel);
      }
    }

    return {
      view: View,
      model: Model
    };
  });
}
