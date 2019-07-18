import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';

import TransactionList from './TransactionList';
import { AppContext } from './App';

const Section = styled.section`
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
  border-radius: 4px;
  padding: 20px;
`;

const BlockDetails = (props) => {
  const { setSelectedTransaction } = useContext(AppContext);

  useEffect(() => {
    // Scroll to top on block change
    window.scrollTo(0, 0);

    // Delete selected transaction on block change
    return () => setSelectedTransaction(null);
  }, [props.number]);

  return <Section
    tabIndex={0}
    onFocus={(e) => {
      if (e.target === e.currentTarget) {
        window.scrollTo(0, 0);
      }
    }}
  >
    <TransactionList {...props}/>
  </Section>;
};

export default BlockDetails;