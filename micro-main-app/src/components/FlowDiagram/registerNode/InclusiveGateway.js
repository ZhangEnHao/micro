export default function InclusiveGateway(lf) {
  lf.register("InclusiveGateway", ({ PolygonNode, PolygonNodeModel, h }) => {
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
              "M510.537016 1014.078844c-67.964659 0-133.907178-13.315997-195.994961-39.576884-59.959897-25.361049-113.805489-61.663802-160.04137-107.897688-46.234883-46.23588-82.536638-100.081472-107.897687-160.041369C20.342111 644.474122 7.026114 578.532601 7.026114 510.567942s13.315997-133.907178 39.576884-195.994962c25.361049-59.959897 61.663802-113.805489 107.897687-160.041369 46.23588-46.234883 100.080475-82.536638 160.04137-107.897687C376.629838 20.373037 442.572357 7.05704 510.537016 7.05704S644.444194 20.373037 706.531977 46.633924c59.959897 25.361049 113.805489 61.663802 160.04137 107.897687 46.234883 46.23588 82.536638 100.080475 107.897687 160.041369 26.260887 62.087783 39.576884 128.030302 39.576884 195.994962s-13.315997 133.907178-39.576884 195.994961c-25.361049 59.959897-61.663802 113.805489-107.897687 160.041369-46.23588 46.234883-100.080475 82.536638-160.04137 107.897688-62.088781 26.260887-128.030302 39.576884-195.994961 39.576884z m0-967.117707c-255.633631 0-463.606804 207.973174-463.606804 463.606805s207.973174 463.606804 463.606804 463.606804 463.606804-207.973174 463.606804-463.606804S766.170647 46.961137 510.537016 46.961137z"
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
