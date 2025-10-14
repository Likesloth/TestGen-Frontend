// src/lib/diagramExport.js

export function downloadPNG(diagram, filenameBase = 'diagram') {
  if (!diagram) return;
  const imgData = diagram.makeImageData({ background: 'white', scale: 1 });
  const a = document.createElement('a');
  a.href = imgData;
  a.download = `${filenameBase}.png`;
  a.click();
}

export function downloadSVG(diagram, filenameBase = 'diagram') {
  if (!diagram) return;
  const svg = diagram.makeSvg({ scale: 1, background: 'white' });
  const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filenameBase}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

