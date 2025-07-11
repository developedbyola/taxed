import React from 'react';

export type Transaction = {
  id: string;
  amount: number;
  companyCode: string;
  meta: {
    title: string;
    description: string;
    logo: string;
  };
  customer: {
    email: string;
    phone_number: string;
    name: string;
  };
  flwRef: string;
  txRef: string;
  txId: number;
  currency: string;
  status: string;
  createdAt: string;
};

type State = {
  transactions: Transaction[];
};

type Action =
  | {
      type: 'SET_TRANSACTIONS';
      payload: { transactions: Transaction[] };
    }
  | {
      type: 'ADD_TRANSACTION';
      payload: { transaction: Transaction };
    };

type Context = State & {
  setTransactions: React.ActionDispatch<[Action]>;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload.transactions };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload.transaction],
      };
    default:
      return state;
  }
};

const Context = React.createContext<Context | null>(null);

export const useTransactions = () => {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error('useTransactions must be used within a Provider');
  }

  return context;
};

export const Provider = ({
  children,
  initialState = {
    transactions: [],
  },
}: {
  children: React.ReactNode;
  initialState?: State;
}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ ...state, setTransactions: dispatch }}>
      {children}
    </Context.Provider>
  );
};
