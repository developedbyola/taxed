import React from 'react';

type Auth = {
  isPending: boolean;
  isAuthenticated: boolean;
  accessToken: string | undefined;
};

type State = {
  auth: Auth;
};

type Action = { type: 'LOGIN'; payload: { auth: Auth } } | { type: 'LOGOUT' };
type Context = State & {
  setAuth: React.Dispatch<Action>;
};

const AuthContext = React.createContext<Context | null>(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, auth: action.payload.auth };
    case 'LOGOUT':
      return {
        ...state,
        auth: {
          isPending: false,
          accessToken: undefined,
          isAuthenticated: false,
        },
      };
    default:
      return state;
  }
};

export const Provider = ({
  children,
  initialState = {
    auth: {
      isPending: true,
      accessToken: undefined,
      isAuthenticated: false,
    },
  },
}: {
  children: React.ReactNode;
  initialState?: State;
}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <AuthContext.Provider value={{ ...state, setAuth: dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
