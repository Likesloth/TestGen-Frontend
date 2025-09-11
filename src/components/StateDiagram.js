// src/components/StateDiagram.js
import React, { useEffect, useRef } from 'react';
import * as go from 'gojs';

// Preprocess graph so that each route ends at a separate final node.
// A final node is detected as any node with zero outgoing links.
function separateFinalNodesPerRoute(nodes = [], links = []) {
  const outgoingCount = new Map(); // nodeKey -> outgoing count
  const incomingByTo = new Map();  // toKey -> array of link indices

  links.forEach((l, idx) => {
    const from = l.from;
    const to = l.to;
    outgoingCount.set(from, (outgoingCount.get(from) || 0) + 1);
    if (!incomingByTo.has(to)) incomingByTo.set(to, []);
    incomingByTo.get(to).push(idx);
  });

  const nodeByKey = new Map(nodes.map(n => [n.key, { ...n }]));
  const finalKeys = nodes
    .map(n => n.key)
    .filter(k => (outgoingCount.get(k) || 0) === 0);

  if (finalKeys.length === 0) return { nodes, links };

  const newNodes = nodes.map(n => ({ ...n }));
  const newLinks = links.map(l => ({ ...l }));

  finalKeys.forEach(finalKey => {
    const incomingIdxs = incomingByTo.get(finalKey) || [];
    // If only one incoming, just standardize label to 'Final'
    if (incomingIdxs.length <= 1) {
      const idx = newNodes.findIndex(n => n.key === finalKey);
      if (idx >= 0) newNodes[idx] = { ...newNodes[idx], label: 'Final' };
      return;
    }

    // Create a distinct clone of the final node per incoming link
    incomingIdxs.forEach((idx, i) => {
      const link = newLinks[idx];
      // Use an internal unique key, but keep the visible label simple
      let cloneKey = `${finalKey}`;
      let attempt = 1;
      while (nodeByKey.has(cloneKey)) {
        attempt += 1;
        cloneKey = `${finalKey}${attempt}`;
      }

      const baseNode = nodeByKey.get(finalKey) || { key: finalKey };
      const cloned = { ...baseNode, key: cloneKey, label: 'Final' };
      newNodes.push(cloned);
      nodeByKey.set(cloneKey, cloned);

      // Rewire this incoming link to the unique final clone
      newLinks[idx] = { ...link, to: cloneKey };
    });

    // Remove original final node if no link points to it anymore
    const stillTargeted = (incomingByTo.get(finalKey) || [])
      .some(i => newLinks[i] && newLinks[i].to === finalKey);
    if (!stillTargeted) {
      const pos = newNodes.findIndex(n => n.key === finalKey);
      if (pos >= 0) newNodes.splice(pos, 1);
    }
  });

  return { nodes: newNodes, links: newLinks };
}

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
        $(go.TextBlock, new go.Binding('text', '', d => (d && d.label) ? d.label : d.key), {
          margin: 6,
          font: 'bold 14px sans-serif'
        })
      );

    // Link template with smarter routing (no labels)
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
        $(go.Shape, { toArrow: 'Standard' })
      );

    // Ensure final nodes are separated per route for clearer diagrams
    const processed = separateFinalNodesPerRoute(nodes, links);
    diagram.model = new go.GraphLinksModel(processed.nodes, processed.links);
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
