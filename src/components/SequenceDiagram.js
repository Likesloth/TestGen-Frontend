// src/components/SequenceDiagram.js
import React, { useEffect, useRef } from 'react';
import * as go from 'gojs';

export default function SequenceDiagram({ nodes = [], links = [] }) {
  const diagramRef = useRef(null);
  const diagramInstance = useRef(null);

  useEffect(() => {
    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, diagramRef.current, {
      initialAutoScale: go.Diagram.Uniform,
      layout: $(go.LayeredDigraphLayout, {
        direction: 90,
        layerSpacing: 60,
        columnSpacing: 30,
        setsPortSpots: false
      }),
      'undoManager.isEnabled': true
    });

    // Node template: show label or key
    diagram.nodeTemplate = $(
      go.Node,
      'Auto',
      { fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides },
      $(go.Shape, 'RoundedRectangle', { fill: '#E3F2FD', strokeWidth: 1 }),
      $(
        go.TextBlock,
        new go.Binding('text', '', (d) => (d && d.label ? d.label : d.key)),
        { margin: 6, font: 'bold 14px sans-serif' }
      )
    );

    // Link template: without event labels
    diagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpGap,
        corner: 10,
        adjusting: go.Link.End,
        relinkableFrom: false,
        relinkableTo: false
      },
      $(go.Shape),
      $(go.Shape, { toArrow: 'Standard' })
    );

    diagram.model = new go.GraphLinksModel(nodes, links);
    diagramInstance.current = diagram;

    return () => {
      diagram.div = null;
    };
  }, [nodes, links]);

  const downloadPNG = () => {
    const imgData = diagramInstance.current.makeImageData({ background: 'white', scale: 1 });
    const a = document.createElement('a');
    a.href = imgData;
    a.download = 'sequence-diagram.png';
    a.click();
  };

  const downloadSVG = () => {
    const svg = diagramInstance.current.makeSvg({ scale: 1, background: 'white' });
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sequence-diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div ref={diagramRef} style={{ width: '100%', height: '600px', border: '1px solid #ddd' }} />
      <div className="mt-4 text-center space-x-4">
        <button onClick={downloadPNG} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Download PNG
        </button>
        <button onClick={downloadSVG} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Download SVG
        </button>
      </div>
    </div>
  );
}
