import React from 'react';
import styled from 'styled-components';
import unit from 'ethjs-unit';
import { colorRowBorder } from './constants';

const Row = styled.li`
  display: flex;
  align-items: center;
  height: 30px;
  border-bottom: 1px ${colorRowBorder} solid;
  padding-left: 5px;
  &:nth-child(2n) {
    background: rgba(252,224,246,0.15);
  }
`;

const Label = styled.div`
  flex: 0 0 100px;
  font-weight: bold;
`;

const Value = styled.div`
  flex: 1;
`;

const TransactionDetails = ({ hash, blockNumber, from, to, value }) => {
  return <ul>
    <Row>
      <Label>Hash</Label>
      <Value>{hash}</Value>
    </Row>
    <Row>
      <Label>Block</Label>
      <Value>{blockNumber}</Value>
    </Row>
    <Row>
      <Label>From</Label>
      <Value>{from}</Value>
    </Row>
    <Row>
      <Label>To</Label>
      <Value>{to}</Value>
    </Row>
    <Row>
      <Label>Value</Label>
      <Value>{unit.fromWei(value, 'ether')} ether</Value>
    </Row>
  </ul>;
};

export default TransactionDetails;