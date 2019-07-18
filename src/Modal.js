import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useTransition, animated } from 'react-spring';

const Overlay = styled(animated.aside)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,.5);
`;

const Content = styled.div`
  height: 500px;
  width: 700px;
  margin: 100px auto;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  position: relative;
`;

const Close = styled.button`
  position: absolute;
  top: 5px;
  right: 10px;
  color: #858585;
  font-size: 30px;
  border: 0;
  padding: 5px 20px;
  &:after {
    content: "+";
    display: block;
    transform: rotate(45deg);
  }
`;

const Modal = ({ children, onClose }) => {
  const transitions = useTransition([{ key: 1 }], item => item.key, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  const overflowRef = useRef();
  const closeRef = useRef();

  useEffect(() => {
    overflowRef.current = document.body.style.overflow;

    // Hide body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Focus close button on mount
    closeRef.current.focus();

    return () => {
      // Restore original body overflow value on unmount
      document.body.style.overflow = overflowRef.current;
    };
  }, []);


  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      onClose(e);
    }
  }

  return createPortal(
    transitions.map(({ props, key }) =>
      <Overlay
        tabIndex={-1}
        style={props}
        key={key}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <Content onKeyDown={handleKeyDown}>
          <Close
            type="button"
            ref={closeRef}
            onClick={onClose}
            tabIndex={0}
          />
          {children}
        </Content>
      </Overlay>
    ),
    document.body
  );
};

export default Modal;