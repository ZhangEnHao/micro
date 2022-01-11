export default function SequenceFlow(lf) {
  lf.register("SequenceFlow", ({ PolylineEdge, PolylineEdgeModel }) => {
    class ConnnectionModel extends PolylineEdgeModel {
      constructor(data, graphModel) {
        super(data, graphModel);
      }
    }
    return {
      view: PolylineEdge,
      model: ConnnectionModel
    };
  });
}
