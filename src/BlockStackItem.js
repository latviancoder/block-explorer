import React, { useContext, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { animated } from 'react-spring';
import { AppContext } from './App';
import { formatSecondsAgo } from './helpers';
import { colorFont, colorHighlight } from './constants';

const Button = styled(animated.button)`
  cursor: pointer;
  padding: 10px;
  border: none;
  border-radius: 4px;
  box-sizing: border-box;
  text-align: left;
  display: flex;
  width: 90px;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,.2);
  position: absolute;
  transition: ease-out 0.3s;
  left: 0;
  &:hover {
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
    h4 {
      color: ${colorFont};
    }
  }
  ${props => props.selected && css`h4 {
    color: ${colorFont};
  }`}
`;

const Number = styled.h4`
  margin: 0;
  text-align: left;
  font-size: 15px;
  font-weight: 600;
  color: ${colorHighlight};
  transition: ease-out 0.3s;
`;

const Ago = styled.div`
  color: #bdbdbd;
`;

const Miner = styled.div`
  width: 75px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BlockStackItem = ({ number, style, timestamp, currentTime, selectedBlock, miner }) => {
  const { handleBlockSelect } = useContext(AppContext);
  const ref = useRef();

  const isSelected = selectedBlock && selectedBlock.number === number;
  const creationTime = new Date(timestamp * 1000);

  // Focus management
  useEffect(() => {
    if (isSelected) {
      ref.current.focus();
    }
  }, [isSelected]);

  return <li>
    <Button
      style={style}
      onClick={() => handleBlockSelect(number)}
      ref={ref}
      tabIndex={!selectedBlock ? 0 : (isSelected ? 0 : -1)}
      selected={isSelected}
    >
      <div>
        <Number>{number}</Number>
        <Miner>{miner}</Miner>
      </div>
      <Ago>{formatSecondsAgo(currentTime, creationTime)}</Ago>
    </Button>
  </li>;
};

export default BlockStackItem;