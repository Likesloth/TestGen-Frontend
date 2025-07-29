// src/components/StateDiagram.js
import React, { useEffect, useRef } from 'react';
import * as go from 'gojs';

export default function StateDiagram({ nodes = [], links = [] }) {
  const diagramRef = useRef(null);
  const diagramInstance = useRef(null);

  useEffect(() => {
    const $ = go.GraphObject.make;

    const diagram =
      $(go.Diagram, diagramRef.current, {
        initialAutoScale: go.Diagram.Uniform,
        layout: $(go.LayeredDigraphLayout, {
          direction: 90,           // Top-down layout
          layerSpacing: 60,
          columnSpacing: 30,
          setsPortSpots: false
        }),
        'undoManager.isEnabled': true
      });

    // Node template with all-side ports
    diagram.nodeTemplate =
      $(go.Node, 'Auto',
        {
          fromSpot: go.Spot.AllSides, // allow links from any side
          toSpot: go.Spot.AllSides    // allow links to any side
        },
        $(go.Shape, 'RoundedRectangle', {
          fill: 'lightblue',
          strokeWidth: 1
        }),
        $(go.TextBlock, new go.Binding('text', 'key'), {
          margin: 6,
          font: 'bold 14px sans-serif'
        })
      );

    // Link template with smarter routing
    diagram.linkTemplate =
      $(go.Link,
        {
          routing: go.Link.AvoidsNodes, // try to avoid overlapping paths
          curve: go.Link.JumpGap,       // jump over crossing links
          corner: 10,
          adjusting: go.Link.End,       // adjust path to final node position
          relinkableFrom: false,
          relinkableTo: false
        },
        $(go.Shape),
        $(go.Shape, { toArrow: 'Standard' }),
        $(go.TextBlock,
          {
            segmentOffset: new go.Point(0, -10),
            font: '12px sans-serif',
            background: 'white'
          },
          new go.Binding('text', 'text')
        )
      );

    diagram.model = new go.GraphLinksModel(nodes, links);
    diagramInstance.current = diagram;

    return () => {
      diagram.div = null;
    };
  }, [nodes, links]);

  const downloadPNG = () => {
    const imgData = diagramInstance.current.makeImageData({
      background: 'white',
      scale: 1
    });
    const a = document.createElement('a');
    a.href = imgData;
    a.download = 'state-diagram.png';
    a.click();
  };

  const downloadSVG = () => {
    const svg = diagramInstance.current.makeSvg({
      scale: 1,
      background: 'white'
    });
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'state-diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div
        ref={diagramRef}
        style={{ width: '100%', height: '600px', border: '1px solid #ddd' }}
      />
      <div className="mt-4 text-center space-x-4">
        <button
          onClick={downloadPNG}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download PNG
        </button>
        <button
          onClick={downloadSVG}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download SVG
        </button>
      </div>
    </div>
  );
}
