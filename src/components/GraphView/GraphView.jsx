import React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { UncontrolledReactSVGPanZoom, fitToViewer as fitValueToViewer } from 'react-svg-pan-zoom';

export function parseSvgDocument(svgText) {
  if (!svgText) {
    return { width: 1, height: 1, viewBox: null, inner: '' };
  }
  const svgMatch = svgText.match(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/i);
  if (svgMatch) {
    const attrs = svgMatch[1] || '';
    const inner = svgMatch[2] || '';
    const widthAttr = (attrs.match(/\bwidth\s*=\s*["']([^"']+)["']/i) || [])[1] || null;
    const heightAttr = (attrs.match(/\bheight\s*=\s*["']([^"']+)["']/i) || [])[1] || null;
    const viewBoxAttr = (attrs.match(/\bviewBox\s*=\s*["']([^"']+)["']/i) || [])[1] || null;
    const widthIsPercent = widthAttr ? widthAttr.trim().endsWith('%') : false;
    const heightIsPercent = heightAttr ? heightAttr.trim().endsWith('%') : false;
    const width = widthAttr && !widthIsPercent ? Number.parseFloat(widthAttr) : Number.NaN;
    const height = heightAttr && !heightIsPercent ? Number.parseFloat(heightAttr) : Number.NaN;
    let parsedWidth = Number.isFinite(width) && width > 0 ? width : Number.NaN;
    let parsedHeight = Number.isFinite(height) && height > 0 ? height : Number.NaN;

    if ((!parsedWidth || !parsedHeight) && viewBoxAttr) {
      const parts = viewBoxAttr.trim().split(/\s+/).map((value) => Number.parseFloat(value));
      if (parts.length === 4 && Number.isFinite(parts[2]) && Number.isFinite(parts[3])) {
        parsedWidth = Math.max(1, parts[2]);
        parsedHeight = Math.max(1, parts[3]);
      }
    }

    return {
      width: parsedWidth || 1,
      height: parsedHeight || 1,
      viewBox: viewBoxAttr,
      inner,
    };
  }

  try {
    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    const root = doc.documentElement;
    const widthAttr = root.getAttribute('width');
    const heightAttr = root.getAttribute('height');
    const viewBox = root.getAttribute('viewBox');
    const widthIsPercent = widthAttr ? widthAttr.trim().endsWith('%') : false;
    const heightIsPercent = heightAttr ? heightAttr.trim().endsWith('%') : false;
    const width = widthAttr && !widthIsPercent ? Number.parseFloat(widthAttr) : Number.NaN;
    const height = heightAttr && !heightIsPercent ? Number.parseFloat(heightAttr) : Number.NaN;

    let parsedWidth = Number.isFinite(width) && width > 0 ? width : Number.NaN;
    let parsedHeight = Number.isFinite(height) && height > 0 ? height : Number.NaN;

    if ((!parsedWidth || !parsedHeight) && viewBox) {
      const parts = viewBox.trim().split(/\s+/).map((value) => Number.parseFloat(value));
      if (parts.length === 4 && Number.isFinite(parts[2]) && Number.isFinite(parts[3])) {
        parsedWidth = Math.max(1, parts[2]);
        parsedHeight = Math.max(1, parts[3]);
      }
    }

    return {
      width: parsedWidth || 1,
      height: parsedHeight || 1,
      viewBox,
      inner: root.innerHTML || '',
    };
  } catch (_err) {
    return { width: 1, height: 1, viewBox: null, inner: '' };
  }
}

export function applySvgColorScheme(svgText, theme) {
  if (!svgText) {
    return '';
  }
  const mode = theme === 'dark' ? 'dark' : 'light';
  const openTagMatch = svgText.match(/<svg\b([^>]*)>/i);
  if (!openTagMatch) {
    return svgText;
  }
  const attrs = openTagMatch[1] || '';
  const styleMatch = attrs.match(/\bstyle\s*=\s*["']([^"']*)["']/i);
  let nextAttrs = attrs;
  if (styleMatch) {
    const prevStyle = styleMatch[1] || '';
    const cleaned = prevStyle
      .replace(/(?:^|;)\s*color-scheme\s*:[^;]*/gi, '')
      .trim()
      .replace(/^;|;$/g, '');
    const nextStyle = `${cleaned ? `${cleaned}; ` : ''}color-scheme: ${mode};`;
    nextAttrs = attrs.replace(styleMatch[0], `style=\"${nextStyle}\"`);
  } else {
    nextAttrs = `${attrs} style=\"color-scheme: ${mode};\"`;
  }
  return svgText.replace(openTagMatch[0], `<svg${nextAttrs}>`);
}

export default function GraphView({
  svgText,
  status,
  errors = [],
  theme,
  onToggleTheme,
  title = 'SVG Preview',
  emptyMessage = 'Rendered SVG will appear here.',
}) {
  const [isManualView, setIsManualView] = useState(false);
  const [viewerSize, setViewerSize] = useState({ width: 640, height: 420 });
  const [svgObjectUrl, setSvgObjectUrl] = useState('');

  const previewShellRef = useRef(null);
  const viewerRef = useRef(null);
  const suppressViewEventsRef = useRef(false);

  const svgDoc = useMemo(() => parseSvgDocument(svgText), [svgText]);
  const themedSvgText = useMemo(() => applySvgColorScheme(svgText, theme), [svgText, theme]);
  const canDownload = useMemo(() => svgText.trim().length > 0, [svgText]);

  useEffect(() => {
    const shell = previewShellRef.current;
    if (!shell) {
      return;
    }

    const updateSize = () => {
      setViewerSize({
        width: Math.max(200, Math.floor(shell.clientWidth)),
        height: Math.max(200, Math.floor(shell.clientHeight)),
      });
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(shell);
    return () => resizeObserver.disconnect();
  }, []);

  function applyFit() {
    const viewer = viewerRef.current;
    if (!viewer || !svgText) {
      return;
    }

    suppressViewEventsRef.current = true;
    try {
      viewer.fitToViewer('center', 'center');
    } finally {
      window.setTimeout(() => {
        suppressViewEventsRef.current = false;
      }, 0);
    }
  }

  useEffect(() => {
    if (!svgText || isManualView) {
      return;
    }
    const id = requestAnimationFrame(() => applyFit());
    return () => cancelAnimationFrame(id);
  }, [svgText, svgDoc.width, svgDoc.height, viewerSize.width, viewerSize.height, isManualView]);

  useEffect(() => {
    if (!themedSvgText) {
      setSvgObjectUrl('');
      return;
    }

    const blob = new Blob([themedSvgText], { type: 'image/svg+xml;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    setSvgObjectUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [themedSvgText]);

  function onUserPanZoom(nextValue) {
    if (suppressViewEventsRef.current) {
      return;
    }

    if (!nextValue || typeof nextValue !== 'object') {
      setIsManualView(true);
      return;
    }

    const fitValue = fitValueToViewer(nextValue, 'center', 'center');
    const nearFit =
      Math.abs(nextValue.a - fitValue.a) < 0.0001 &&
      Math.abs(nextValue.e - fitValue.e) < 1 &&
      Math.abs(nextValue.f - fitValue.f) < 1;
    setIsManualView(!nearFit);
  }

  function downloadSvg() {
    if (!canDownload) {
      return;
    }

    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'graph.svg';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="pane-header row">
        <div>
          <h2>{title}</h2>
          <p>{status}</p>
        </div>
        <div className="controls">
          <button type="button" onClick={downloadSvg} disabled={!canDownload}>
            Download SVG
          </button>
          <button type="button" className="mode-btn" onClick={onToggleTheme}>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </div>

      <div className="errors" role="status">
        {errors.map((err, idx) => (
          <div key={`${idx}-${err}`} className="error-item">
            {err}
          </div>
        ))}
      </div>

      <div className="preview-shell" ref={previewShellRef}>
        {svgText ? (
          <UncontrolledReactSVGPanZoom
            ref={viewerRef}
            width={viewerSize.width}
            height={viewerSize.height}
            defaultTool="auto"
            detectAutoPan={false}
            detectWheel
            background="transparent"
            SVGBackground="transparent"
            toolbarProps={{ position: 'right', SVGAlignX: 'center', SVGAlignY: 'center' }}
            miniatureProps={{ position: 'none' }}
            onPan={onUserPanZoom}
            onZoom={onUserPanZoom}
            scaleFactorOnWheel={1.06}
          >
            <svg width={svgDoc.width} height={svgDoc.height} viewBox={`0 0 ${svgDoc.width} ${svgDoc.height}`}>
              <image
                href={svgObjectUrl || ''}
                width={svgDoc.width}
                height={svgDoc.height}
                preserveAspectRatio="xMidYMid meet"
              />
            </svg>
          </UncontrolledReactSVGPanZoom>
        ) : (
          <div className="preview-empty">{emptyMessage}</div>
        )}
      </div>
    </>
  );
}
