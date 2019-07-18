import React, { useContext } from 'react';
import styled from 'styled-components';

import { AppContext } from './App';
import TransactionListItem from './TransactionListItem';
import { colorRowBorder } from './constants';
import Modal from './Modal';
import TransactionDetails from './TransactionDetails';

const Header = styled.header`
  display: flex;
  align-items: center;
  height: 30px;
  border-top: 1px ${colorRowBorder} solid;
  border-bottom: 1px ${colorRowBorder} solid;
  background: rgba(228,222,225,0.21);
`;

const Column = styled.div`
  flex: 0 0 33%;
  padding-left: 5px;
`;

const TransactionList = ({ transactions, selectedTransaction, isTransactionModalOpen }) => {
  const { handleTransactionSelect, setTransactionModal } = useContext(AppContext);

  // Keyboard accessible navigation
  function handleKeyDown(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    } else {
      return;
    }

    const currentIndex = selectedTransaction && transactions.findIndex(t => t.hash === selectedTransaction.hash);
    if (currentIndex === undefined) {
      return;
    }
    
    let targetIndex;

    if (e.key === 'ArrowUp' && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    } else if (e.key === 'ArrowDown' && currentIndex < transactions.length - 1) {
      targetIndex = currentIndex + 1;
    }

    handleTransactionSelect(transactions[targetIndex].hash);
  }

  return <ul onKeyDown={handleKeyDown}>
    <Header>
      <Column>Hash</Column>
      <Column>From</Column>
      <Column>To</Column>
    </Header>
    {transactions.map((t) => {
      const isSelected = !!(selectedTransaction && selectedTransaction.hash === t.hash);

      return <TransactionListItem
        key={t.hash}
        {...t}
        tabIndex={!selectedTransaction ? 0 : (isSelected ? 0 : -1)}
        isFocused={!isTransactionModalOpen && isSelected}
      />;
    })}

    {selectedTransaction && isTransactionModalOpen && (
      <Modal
        onClose={() => {
          setTransactionModal(false);
        }}
      >
        <TransactionDetails {...selectedTransaction}/>
      </Modal>
    )}
  </ul>;
};

export default TransactionList;