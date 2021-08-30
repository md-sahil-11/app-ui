import React from "react";
import {
  DiagramWidget,
  DiagramEngine,
  DefaultNodeFactory,
  DefaultLinkFactory,
  DiagramModel,
  DefaultNodeModel,
  DefaultPortModel,
  LinkModel,
} from "storm-react-diagrams";

import "./style.css";

class BasicConnection extends React.Component {
  componentWillMount() {
    this.engine = new DiagramEngine();

    this.engine.registerNodeFactory(new DefaultNodeFactory());
    this.engine.registerLinkFactory(new DefaultLinkFactory());

    const model = new DiagramModel();

    const node1 = new DefaultNodeModel("Source", "rgb(0,192,255)");
    const port1 = node1.addPort(new DefaultPortModel(false, "out-1", "Out"));
    node1.x = 100;
    node1.y = 100;

    const node2 = new DefaultNodeModel("Destination", "rgb(192,255,0)");
    const port2 = node2.addPort(new DefaultPortModel(true, "in-1", "In"));
    node2.x = 400;
    node2.y = 100;

    const link1 = new LinkModel();
    link1.setSourcePort(port1);
    link1.setTargetPort(port2);

    model.addNode(node1);
    model.addNode(node2);
    model.addLink(link1);

    this.engine.setDiagramModel(model);
    this.changeSelection(node1);
    this.changeSelection(node2);

    model.addListener({
      nodesUpdated: function (e) {
		console.log('event occured')
      },
      zoomUpdated: function (e) {
		console.log('event occured')
      },
	  gridUpdated: (e) => {
		console.log('event occured') 
	  },
	  linksUpdated: (e) => {
		console.log(e)
		console.log('event occured') 
	  },
	  offsetUpdated: (e) => {
		console.log('event occured') 
	  }
    });
  }

  changeSelection(node) {
    node.addListener({
      selectionChanged: () => {
        console.log("selectionChanged");
      },
    });
  }

  render() {
    return (
      <div>
        <DiagramWidget diagramEngine={this.engine} />
      </div>
    );
  }
}

export default BasicConnection;
