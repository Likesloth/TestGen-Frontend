// src/components/StateDiagram.js
import React, { useEffect, useRef } from 'react';
import * as go from 'gojs';
import { downloadPNG as savePNG, downloadSVG as saveSVG } from '../lib/diagramExport';

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

// Duplicate any node that has more than one incoming link so that
// each parent points to its own instance. This prevents back-edges
// like Occupied -> Vacant from reusing the original Vacant node.
function separateNodesPerIncoming(nodes = [], links = []) {
  const incomingByTo = new Map();
  links.forEach((l, idx) => {
    const to = l.to;
    if (!incomingByTo.has(to)) incomingByTo.set(to, []);
    incomingByTo.get(to).push(idx);
  });

  const nodeByKey = new Map(nodes.map(n => [n.key, { ...n }]));
  const newNodes = nodes.map(n => ({ ...n }));
  const newLinks = links.map(l => ({ ...l }));

  for (const [toKey, incomingIdxs] of incomingByTo.entries()) {
    if (!toKey) continue;
    if (!incomingIdxs || incomingIdxs.length <= 1) continue;

    // Keep the first incoming pointing to the original node.
    // For all additional incoming links, create a unique clone target.
    for (let i = 1; i < incomingIdxs.length; i++) {
      const idx = incomingIdxs[i];
      const link = newLinks[idx];

      // Create a unique key for the clone
      let cloneKey = `${toKey}`;
      let attempt = 1;
      while (nodeByKey.has(cloneKey)) {
        attempt += 1;
        cloneKey = `${toKey}${attempt}`;
      }

      const baseNode = nodeByKey.get(toKey) || { key: toKey };
      const cloned = { ...baseNode, key: cloneKey, label: baseNode.label || baseNode.key };
      newNodes.push(cloned);
      nodeByKey.set(cloneKey, cloned);

      // Rewire this incoming link to the unique clone
      newLinks[idx] = { ...link, to: cloneKey };
    }
  }

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

    // Link template with smarter routing + optional text labels (events)
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
        // Centered label if link has a 'text' property
        $(go.Panel, 'Auto',
          { segmentIndex: NaN, segmentFraction: 0.5 },
          $(go.Shape, { fill: 'rgba(255,255,255,0.85)', stroke: null }),
          $(go.TextBlock,
            {
              margin: 3,
              font: '10px sans-serif',
              stroke: '#333'
            },
            new go.Binding('text', 'text')
          )
        )
      );

    // First, duplicate nodes that have multiple incoming links
    const splitIncoming = separateNodesPerIncoming(nodes, links);
    // Then, ensure final nodes are separated per route for clearer diagrams
    const processed = separateFinalNodesPerRoute(splitIncoming.nodes, splitIncoming.links);
    diagram.model = new go.GraphLinksModel(processed.nodes, processed.links);
    diagramInstance.current = diagram;

    return () => {
      diagram.div = null;
    };
  }, [nodes, links]);

  const downloadPNG = () => savePNG(diagramInstance.current, 'state-diagram');
  const downloadSVG = () => saveSVG(diagramInstance.current, 'state-diagram');

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
