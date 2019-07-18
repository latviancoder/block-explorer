import React, { createContext, useEffect, useMemo } from 'react';
import Web3 from 'web3';
import useMethods from 'use-methods';
import styled, { createGlobalStyle } from 'styled-components';

import BlockStack from './BlockStack';
import BlockDetails from './BlockDetails';
import { colorBg, colorFont } from './constants';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Open Sans', sans-serif;
    background: ${colorBg};
    margin: 0;
    color: ${colorFont};
    font-size: 13px;
  }
  * {
    box-sizing: border-box;
    outline-width: 3px;
    outline-color: #aa9eff;
  }
  button {
    font-family: 'Open Sans', sans-serif;
  }
  ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }
`;

const Container = styled.div`
  margin: 0 auto;
  width: 1000px;
`;

export const AppContext = createContext(null);

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/fcf3b4a79ace4723886d0ab0377deedb'));
const web3ws = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/fcf3b4a79ace4723886d0ab0377deedb'));

const initialState = {
  blockStack: [],
  selectedBlock: null,
  selectedTransaction: null,
  isTransactionModalOpen: false
};

const methods = state => ({
  setInitialBlocks(blocks) {
    state.blockStack.unshift(...blocks);
  },

  addBlock(block) {
    // Avoid adding duplicate blocks
    const blockExists = state.blockStack.some(b => b.number === block.number);

    if (state.blockStack.length > 0 && !blockExists) {
      state.blockStack.shift();
    }

    if (!blockExists) {
      state.blockStack.push(block);
    }
  },

  setSelectedBlock(block) {
    state.selectedBlock = block;
  },

  setSelectedTransaction(transaction) {
    state.selectedTransaction = transaction;
  },

  setTransactionModal(isOpen) {
    state.isTransactionModalOpen = isOpen;
  },
});

function App() {
  const [
    state,
    dispatch
  ] = useMethods(methods, initialState);

  // Fetch initial 10 blocks using regular http api
  useEffect(() => {
    const fetchInitialBlocks = async () => {
      const batch = new web3.eth.BatchRequest();
      const latest = await web3.eth.getBlockNumber();

      for (let i = latest - 9; i <= latest; i++) {
        batch.add(web3.eth.getBlock.request(i, () => {
        }));
      }

      const { response } = await batch.execute();

      dispatch.setInitialBlocks(response);
    };

    fetchInitialBlocks();
  }, []);

  // Subscribe to web3 websocket API to receive stream of new blocks
  useEffect(() => {
    let subscription;

    subscription = web3ws.eth.subscribe('newBlockHeaders');

    subscription
      .subscribe((error) => {
        if (error) console.log(error);
      })
      .on('data', async (response) => {
        dispatch.addBlock(response);
      });
  }, []);

  const handleBlockSelect = async (blockNumber) => {
    const block = await web3.eth.getBlock(blockNumber, true);
    dispatch.setSelectedBlock(block);
  };

  const handleTransactionSelect = async (hash) => {
    const transaction = await web3.eth.getTransaction(hash);
    dispatch.setSelectedTransaction(transaction);
    dispatch.setTransactionModal(true);
  };

  // Avoid callback props drilling
  const contextValue = useMemo(() => ({
    handleBlockSelect,
    handleTransactionSelect,
    ...dispatch
  }), []);

  return <AppContext.Provider value={contextValue}>
    <GlobalStyle/>
    <Container>
      <BlockStack
        selectedBlock={state.selectedBlock}
        blockStack={state.blockStack}
      />
      {state.selectedBlock && (
        <BlockDetails
          {...state.selectedBlock}
          selectedTransaction={state.selectedTransaction}
          isTransactionModalOpen={state.isTransactionModalOpen}
        />
      )}
    </Container>
  </AppContext.Provider>;
}

export default App;
