import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import GraphView, { applySvgColorScheme, parseSvgDocument } from './GraphView.jsx';

const { fitToViewerSpy } = vi.hoisted(() => ({
  fitToViewerSpy: vi.fn(),
}));

vi.mock('react-svg-pan-zoom', async () => {
  const React = await import('react');

  const fitToViewer = (value) => ({
    ...value,
    a: 1,
    e: 0,
    f: 0,
  });

  const UncontrolledReactSVGPanZoom = React.forwardRef(function MockViewer(props, ref) {
    React.useImperativeHandle(ref, () => ({
      fitToViewer: (...args) => fitToViewerSpy(...args),
    }));

    return (
      <div data-testid="svg-viewer" data-width={props.width} data-height={props.height}>
        <button
          type="button"
          onClick={() =>
            props.onPan?.({
              lastAction: 'pan',
              a: 1,
              e: 120,
              f: 45,
            })
          }
        >
          mock-pan
        </button>
        <button
          type="button"
          onClick={() =>
            props.onZoom?.({
              lastAction: 'zoom',
              a: 1,
              e: 0,
              f: 0,
            })
          }
        >
          mock-fit
        </button>
        {props.children}
      </div>
    );
  });

  return {
    UncontrolledReactSVGPanZoom,
    fitToViewer,
  };
});

function defaultProps(overrides = {}) {
  return {
    svgText: '',
    status: 'Rendered.',
    errors: [],
    theme: 'light',
    onToggleTheme: vi.fn(),
    ...overrides,
  };
}

describe('GraphView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('requestAnimationFrame', (cb) => {
      cb();
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {});
    vi.stubGlobal('ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    );
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  });

  it('renders empty preview state with status and controls', () => {
    const props = defaultProps({ status: 'Schema loaded.' });
    render(<GraphView {...props} />);

    expect(screen.getByText('SVG Preview')).toBeInTheDocument();
    expect(screen.getByText('Schema loaded.')).toBeInTheDocument();
    expect(screen.getByText('Rendered SVG will appear here.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download svg/i })).toBeDisabled();
  });

  it('renders svg viewer and enables download for svg content', () => {
    const props = defaultProps({
      svgText: '<svg width="100" height="50"><rect width="100" height="50"/></svg>',
      status: 'Rendered.',
    });
    render(<GraphView {...props} />);

    expect(screen.getByTestId('svg-viewer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download svg/i })).toBeEnabled();
  });

  it('calls onToggleTheme when mode button is clicked', () => {
    const onToggleTheme = vi.fn();
    render(<GraphView {...defaultProps({ onToggleTheme })} />);
    fireEvent.click(screen.getByRole('button', { name: /dark mode/i }));
    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('applies fit on first render with svg then pauses after manual pan', async () => {
    render(
      <GraphView
        {...defaultProps({
          svgText: '<svg width="100" height="50"><rect width="100" height="50"/></svg>',
        })}
      />
    );

    expect(fitToViewerSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
    const fitCallsBeforePan = fitToViewerSpy.mock.calls.length;

    fireEvent.click(screen.getByRole('button', { name: 'mock-pan' }));

    await act(async () => {
      // force rerender by same props from testing library noop timers
      await Promise.resolve();
    });

    expect(fitToViewerSpy).toHaveBeenCalledTimes(fitCallsBeforePan);

    fireEvent.click(screen.getByRole('button', { name: 'mock-fit' }));
  });

  it('renders provided errors', () => {
    render(<GraphView {...defaultProps({ errors: ['Bad schema', 'Render failed'] })} />);
    expect(screen.getByText('Bad schema')).toBeInTheDocument();
    expect(screen.getByText('Render failed')).toBeInTheDocument();
  });

  it('renders profile and theme metadata when provided', () => {
    render(
      <GraphView
        {...defaultProps({
          profileId: 'default',
          profileVersion: 3,
          profileStage: 'published',
          profileChecksum: '1234567890abcdef',
          themeId: 'midnight',
          themeVersion: 4,
          themeStage: 'published',
          themeChecksum: 'fedcba0987654321',
          iconsetResolutionChecksum: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          iconsetSources: [
            { iconsetId: 'default', iconsetVersion: 1 },
            { iconsetId: 'team-a', iconsetVersion: 3 },
          ],
        })}
      />
    );

    expect(screen.getByTestId('profile-meta').textContent).toContain('Profile: default');
    expect(screen.getByTestId('profile-meta').textContent).toContain('v3');
    expect(screen.getByTestId('profile-meta').textContent).toContain('published');
    expect(screen.getByTestId('profile-meta').textContent).toContain('1234567890ab');
    expect(screen.getByTestId('profile-meta').textContent).toContain('Theme: midnight');
    expect(screen.getByTestId('profile-meta').textContent).toContain('v4');
    expect(screen.getByTestId('profile-meta').textContent).toContain('fedcba098765');
    expect(screen.getByTestId('profile-meta').textContent).toContain('Iconsets');
    expect(screen.getByTestId('profile-meta').textContent).toContain('default@1,team-a@3');
    expect(screen.getByTestId('profile-meta').textContent).toContain('abcdefabcdef');
  });
});

describe('GraphView helpers', () => {
  it('parseSvgDocument reads dimensions from viewBox when width/height are percentages', () => {
    const parsed = parseSvgDocument('<svg width="100%" height="100%" viewBox="0 0 300 120"><g/></svg>');
    expect(parsed.width).toBe(300);
    expect(parsed.height).toBe(120);
  });

  it('applySvgColorScheme updates svg style color-scheme', () => {
    const out = applySvgColorScheme('<svg style="fill:red;color-scheme: light;"><g/></svg>', 'dark');
    expect(out).toContain('color-scheme: dark;');
  });
});
