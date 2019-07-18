import React, { memo, useContext, useEffect, useRef } from 'react';
import { AppContext } from './App';
import styled from 'styled-components';
import { colorFont, colorHighlight, colorRowBorder } from './constants';

const Button = styled.button`
  display: block;
  border: 0;
  padding: 0;
  cursor: pointer;
  color: ${colorHighlight};
  transition: ease-out 0.3s;
  font-size: 12px;
  margin: 0;
  &:hover {
    color: ${colorFont};
  }
`;

const Row = styled.li`
  display: flex;
  align-items: center;
  height: 30px;
  border-bottom: 1px ${colorRowBorder} solid;
  &:nth-child(2n + 1) {
    background: rgba(252,224,246,0.15);
  }
`;

const Column = styled.div`
  flex: 0 0 33%;
  padding-left: 5px;
`;

const Ellipsis = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 300px;
`;

const TransactionListItem = memo(({ isFocused, tabIndex, hash, from, to }) => {
  const ref = useRef();
  const { handleTransactionSelect } = useContext(AppContext);

  // Focus management
  useEffect(() => {
    if (isFocused) {
      ref.current.focus();
    } else {
      ref.current.blur();
    }
  }, [isFocused]);

  return <Row key={hash}>
    <Column>
      <Button
        type="button"
        ref={ref}
        onClick={() => handleTransactionSelect(hash)}
        tabIndex={tabIndex}
      >
        <Ellipsis>{hash}</Ellipsis>
      </Button>
    </Column>
    <Column>
      <Ellipsis>{from}</Ellipsis>
    </Column>
    <Column>
      <Ellipsis>{to}</Ellipsis>
    </Column>
  </Row>;
});

export default TransactionListItem;