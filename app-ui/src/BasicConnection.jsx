import React, { useEffect, useState } from "react";
import axios from "axios";

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

const BasicConnection = () => {
  let data = {
    "components": [],
    "links": [],
  };
  const [state, setState] = useState(data);
  const engine = new DiagramEngine();

  const updateComponents = (id1, id2) => {
	const comp = state['components'];
	const links = state['links'];
	comp.push({
		"id": id1,      
		"name": "Source"
	})
	comp.push({
		"id": id2,
		"name": "Destination"
	})
	links.push({"src": id1, "dest": id2});
	data['components'] = comp;
	data['links'] = links;
	setState(data);
	sendState(data);
  }

  const updateState = (e) => {
	const component = state["components"];
    const links = state["links"];
	const link = {"src": e.sourcePort.id, "dest": undefined};
	
	if(e.targetPort) link['dest'] = e.targetPort.id
	links.push(link);
	data["components"] = component;
	data["links"] = links;
	setState(data);
	sendState(state);
  };
  
  const sendState = state => {
	axios({
		method: "post",
		url: "http://localhost:3000/api/state/cache",
		data: state,
		headers: {
		  "Content-Type": "application/json"
		}
	  })
	  .then(function (response) {
		console.log(response.data);
	  })
	  .catch(function (error) {
		console.log(error);
	  });
  }

  useEffect(() => {
    engine.registerNodeFactory(new DefaultNodeFactory());
    engine.registerLinkFactory(new DefaultLinkFactory());

    const model = new DiagramModel();

    const node1 = new DefaultNodeModel("Source", "rgb(0,192,255)");
    const port1 = node1.addPort(new DefaultPortModel(false, "out-1", "Out"));
    node1.x = 100;
    node1.y = 100;

    const node2 = new DefaultNodeModel("Destination", "rgb(192,255,0)");
    const port2 = node2.addPort(new DefaultPortModel(true, "in-1", "In"));
    node2.x = 400;
    node2.y = 100;

	updateComponents(node1.id, node2.id)

    const link1 = new LinkModel();
    link1.setSourcePort(port1);
    link1.setTargetPort(port2);

    model.addNode(node1);
    model.addNode(node2);
    model.addLink(link1);

	//some events listeners
    engine.setDiagramModel(model);
    changeSelection(node1);
    changeSelection(node2);

    model.addListener({
      nodesUpdated: function (e) {
        eventOccur();
      },
      zoomUpdated: function (e) {
        eventOccur();
      },
      gridUpdated: (e) => {
        eventOccur();
      },
      linksUpdated: (e) => {
        eventOccur();
        updateState(e);
      },
      offsetUpdated: (e) => {
        eventOccur();
      },
    });
  });

  const eventOccur = () => {
    console.log("event occured");
  };

  const changeSelection = (node) => {
    node.addListener({
      selectionChanged: () => {
        console.log("selection changed");
      },
    });
  };

  return (
    <div>
      <DiagramWidget diagramEngine={engine} />
    </div>
  );
};

export default BasicConnection;
