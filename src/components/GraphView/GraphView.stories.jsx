import React from 'react';
import { useState } from 'react';
import GraphView from './GraphView.jsx';

const SAMPLE_SVG = `<svg width="480" height="220" viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="480" height="220" fill="#f8fafc"/>
  <circle cx="120" cy="110" r="40" fill="#2563eb"/>
  <circle cx="360" cy="110" r="40" fill="#059669"/>
  <line x1="160" y1="110" x2="320" y2="110" stroke="#334155" stroke-width="4"/>
  <text x="120" y="116" text-anchor="middle" font-size="14" fill="#ffffff">A</text>
  <text x="360" y="116" text-anchor="middle" font-size="14" fill="#ffffff">B</text>
</svg>`;

function GraphViewStoryHarness(args) {
  const [theme, setTheme] = useState(args.theme);

  return (
    <div style={{ height: '78vh', minHeight: 460, padding: 12 }}>
      <GraphView
        {...args}
        theme={theme}
        onToggleTheme={() => {
          setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
        }}
      />
    </div>
  );
}

const meta = {
  title: 'Components/GraphView',
  component: GraphView,
  tags: ['autodocs'],
  render: (args) => <GraphViewStoryHarness {...args} />,
  args: {
    title: 'SVG Preview',
    status: 'Rendered.',
    errors: [],
    svgText: SAMPLE_SVG,
    theme: 'light',
    profileId: 'default',
    profileVersion: 4,
    profileStage: 'published',
    profileChecksum: '9f9e2f9968c3074cd2da6e4f9584ef2bd18ee7dc8e64555758968f5ecf20f355',
  },
};

export default meta;

export const Rendered = {};

export const Empty = {
  args: {
    svgText: '',
    status: 'Waiting for render input.',
  },
};

export const WithErrors = {
  args: {
    status: 'Render failed.',
    errors: ['Validation error at /links/0/from', 'Unknown node type: aggregator'],
  },
};
