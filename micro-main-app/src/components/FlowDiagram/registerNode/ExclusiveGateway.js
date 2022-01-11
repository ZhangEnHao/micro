export default function ExclusiveGateway(lf) {
  lf.register("ExclusiveGateway", ({ PolygonNode, PolygonNodeModel, h }) => {
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
              "M216.91904 188.61056l648.2176 648.25856M198.81472 206.71488L740.9664 748.9024l106.06592 106.07104c23.36768 23.36768 59.5712-12.83584 36.20864-36.1984L341.08928 276.5824 235.02336 170.50624c-23.36768-23.36256-59.5712 12.84096-36.20864 36.20864z"
          }),
          h("path", {
            fill: "#27c2c1",
            d:
              "M865.13664 188.61056L216.91904 836.86912M847.03232 170.50624C666.32192 351.232 485.59616 531.95776 304.88064 712.69376l-106.06592 106.07616c-23.36256 23.36256 12.84096 59.5712 36.20352 36.1984L777.16992 312.7808l106.07104-106.07104c23.35744-23.36256-12.84096-59.56608-36.20864-36.20352z"
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
