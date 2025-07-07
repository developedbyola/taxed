import React from 'react';

type User = {
  id: string;
  email: string;
  lastName: string;
  firstName: string;
  created_at: string;
};

type State = {
  user: User | null;
};
type Action =
  | {
      type: 'SET_USER';
      payload: { user: User };
    }
  | {
      type: 'UNSET_USER';
      payload?: never;
    }
  | {
      type: 'UPDATE_USER';
      payload: { user: Partial<User> };
    };

type Context = State & {
  setUser: React.ActionDispatch<[Action]>;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload.user };
    case 'UNSET_USER':
      return { ...state, user: null };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user!, ...action.payload.user } };
    default:
      return state;
  }
};

const Context = React.createContext<Context | null>(null);

export const Provider = ({
  children,
  initialState = {
    user: null,
  },
}: {
  children: React.ReactNode;
  initialState?: State;
}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ ...state, setUser: dispatch }}>
      {children}
    </Context.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
