import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTransition, animated, useSpring } from 'react-spring';
import styled, { css } from 'styled-components';

import BlockStackItem from './BlockStackItem';
import { useInterval } from './helpers';
import { AppContext } from './App';

const Nav = styled(animated.nav)`
  padding: 0;
  margin: 10px 0 0 0;
  position: relative;
  height: 90px;
  ${props => props.issticky && css`
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    margin-top: 0;
    padding-top: 10px;
  `}
`;

const List = styled(animated.ul)`
  width: 1000px;
  margin: 0 auto;
  position: relative;
`;

const Placeholder = styled.div`
  ${props => props.issticky && css`
    height: 100px;
  `}
`;

const BlockStack = ({ blockStack, selectedBlock }) => {
  const { handleBlockSelect } = useContext(AppContext);
  const [initial, setInitial] = useState(true);
  const [isSticky, setSticky] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());

  useInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  useEffect(() => {
    if (blockStack.length > 0) {
      setInitial(false);
    }
  }, [blockStack]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, false);
    return () => window.removeEventListener('scroll', handleScroll, false);
  }, []);

  const transitions = useTransition(
    blockStack.map((data, i) => ({ ...data, left: i * 101 })),
    item => item.number,
    {
      from: { opacity: 0 },
      enter: ({ left }) => ({ left: left, opacity: 1 }),
      leave: ({ left }) => ({ left: left - 101, opacity: 0 }),
      update: ({ left }) => ({ left }),
      immediate: initial
    }
  );

  const navSpring = useSpring({
    background: isSticky ? '#fff' : 'rgba(255,255,255,0)',
    boxShadow: isSticky ? '0px 1px 6px 0px rgba(0,0,0,0.1)' : '0px 0px 0px 0px rgba(0,0,0,0)'
  });

  function handleScroll() {
    if (window.scrollY > 0) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  }

  // Keyboard accessible navigation
  function handleKeyDown(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
    } else {
      return;
    }

    const currentIndex = selectedBlock && blockStack.findIndex(b => b.number === selectedBlock.number);
    if (currentIndex === null) {
      return;
    }

    let targetIndex;

    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    } else if (e.key === 'ArrowRight' && currentIndex < blockStack.length - 1) {
      targetIndex = currentIndex + 1;
    }

    if (targetIndex !== undefined) {
      handleBlockSelect(blockStack[targetIndex].number);
    }
  }

  return (
    <Placeholder issticky={isSticky}>
      <Nav issticky={isSticky} onKeyDown={handleKeyDown} style={navSpring}>
        <List>
          {transitions.map(({ item, props: { left, ...rest }, key }) =>
            <BlockStackItem
              {...item}
              key={key}
              style={{ transform: left.interpolate(left => `translate3d(${left}px,0,0)`), ...rest }}
              currentTime={currentTime}
              selectedBlock={selectedBlock}
            />
          )}
        </List>
      </Nav>
    </Placeholder>
  );
};

export default BlockStack;