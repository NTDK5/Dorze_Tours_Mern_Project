import React, { useRef } from 'react';
import { useFloating, shift } from '@floating-ui/react-dom';

const ShiftExample = () => {
  const referenceRef = useRef(null);
  const floatingRef = useRef(null);

  const { x, y, strategy } = useFloating({
    middleware: [shift()],
    placement: 'bottom', // Default placement
  });

  const handleScroll = () => {
    const referenceElement = referenceRef.current;
    const floatingElement = floatingRef.current;

    if (referenceElement && floatingElement) {
      const referenceRect = referenceElement.getBoundingClientRect();

      if (referenceRect.top <= 0) {
        // When reference is at the top, place floating at the top
        floatingElement.style.top = '0px';
        floatingElement.style.bottom = 'auto';
      } else {
        // When reference is not at the top, place floating at the bottom
        floatingElement.style.top = 'auto';
        floatingElement.style.bottom = '0px';
      }
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Scrollable Content */}
      <div
        style={{
          overflowY: 'scroll',
          height: '100vh',
          flex: 1,
          padding: '20px',
        }}
        onScroll={handleScroll}
      >
        <h1>Main Content Area</h1>
        <p>This content is scrollable.</p>
        <p>Lorem ipsum dolor sit amet...</p>
        <div style={{ height: '150vh' }} />
      </div>

      {/* Floating Element */}
      <div
        ref={referenceRef}
        style={{
          position: 'sticky',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '20px',
          background: '#f0f0f0',
          padding: '10px',
          borderRadius: '4px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          ref={floatingRef}
          style={{
            position: strategy,
            left: x ?? 0,
            top: y ?? 0,
            background: 'lightblue',
            padding: '8px',
            borderRadius: '4px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          I move up and down!
        </div>
      </div>
    </div>
  );
};

export default ShiftExample;
