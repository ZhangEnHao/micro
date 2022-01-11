export default function ParallelGateway(lf) {
  lf.register("ParallelGateway", ({ PolygonNode, PolygonNodeModel, h }) => {
    class Node extends PolygonNode {
      getIconShape() {
        return h(
          "svg",
          {
            x: 13,
            y: 13,
            width: 24,
            height: 24,
            viewBox: "0 0 1024 1024"
          },
          h("path", {
            fill: "#27c2c1",
            d:
              "M544.83 557.536l374.19 0.973c17.694 0.046 32.039-14.21 32.085-31.904 0.045-17.74-14.21-32.04-31.904-32.086l-374.258-0.995 0.566-372.561c0.022-17.627-14.256-31.995-31.95-32.041-17.672-0.022-32.018 14.278-32.064 31.973l-0.564 372.47-373.986-0.996c-17.695-0.045-32.04 14.21-32.086 31.904-0.022 8.849 3.552 16.903 9.368 22.719 5.769 5.77 13.734 9.345 22.537 9.367l374.076 0.996-0.565 375.955c-0.023 8.846 3.553 16.856 9.368 22.671 5.793 5.793 13.78 9.346 22.583 9.369 17.672 0.022 31.995-14.256 32.04-31.95L544.83 557.536 544.83 557.536z"
          })
        );
      }
      getShape() {
        const attributes = this.getAttributes();

        const {
          width,
          height,
          x,
          y,
          fillOpacity,
          strokeWidth,
          strokeOpacity,
          points
        } = attributes;
        const transform = `matrix(1 0 0 1 ${x - width / 2} ${y - height / 2})`;
        const pointsPath = points.map(point => point.join(",")).join(" ");
        return h(
          "g",
          {
            transform
          },
          [
            h("polygon", {
              points: pointsPath,
              fill: "#e7f7f7",
              stroke: "#27c2c1",
              strokeWidth,
              strokeOpacity,
              fillOpacity
            }),
            this.getIconShape()
          ]
        );
      }
    }
    class Model extends PolygonNodeModel {
      constructor(data, graphModel) {
        data.text = {
          value: (data.text && data.text.value) || "",
          x: data.x,
          y: data.y + 35,
          dragable: false,
          editable: false
        };
        super(data, graphModel);
        const lenght = 25;
        this.points = [
          [lenght, 0],
          [lenght * 2, lenght],
          [lenght, lenght * 2],
          [0, lenght]
        ];
      }
    }
    return {
      view: Node,
      model: Model
    };
  });
}
