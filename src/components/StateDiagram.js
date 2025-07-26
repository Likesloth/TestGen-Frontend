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
          direction: 0,
          layerSpacing: 40,
          columnSpacing: 20
        }),
        'undoManager.isEnabled': true
      });

    diagram.nodeTemplate =
      $(go.Node, 'Auto',
        $(go.Shape, 'RoundedRectangle', {
          fill: 'lightblue',
          strokeWidth: 1
        }),
        $(go.TextBlock, new go.Binding('text', 'key'), {
          margin: 6,
          font: 'bold 14px sans-serif'
        })
      );

    diagram.linkTemplate =
      $(go.Link,
        $(go.Shape),
        $(go.Shape, { toArrow: 'Standard' }),
        $(go.TextBlock, new go.Binding('text', 'text'), {
          segmentOffset: new go.Point(0, -10),
          font: '12px sans-serif'
        })
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
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
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
        style={{ width: '100%', height: '400px', border: '1px solid #ddd' }}
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
