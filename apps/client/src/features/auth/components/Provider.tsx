import React from 'react';
import Cookies from 'js-cookie';

type Auth = {
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | undefined;
  refreshToken: string | undefined;
};

type State = {
  auth: Auth;
};

type Action =
  | {
      type: 'LOGIN';
      payload: { auth: Pick<Auth, 'accessToken' | 'refreshToken'> };
    }
  | { type: 'LOGOUT' };
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
      Cookies.set('refresh_token', action.payload.auth.refreshToken!, {
        expires: 30,
        secure: false,
        httpOnly: false,
        sameSite: 'Lax',
      });
      return {
        ...state,
        auth: {
          isLoading: false,
          isAuthenticated: true,
          accessToken: action.payload.auth.accessToken,
          refreshToken: action.payload.auth.refreshToken,
        },
      };
    case 'LOGOUT':
      return {
        ...state,
        auth: {
          isLoading: false,
          accessToken: undefined,
          isAuthenticated: false,
          refreshToken: undefined,
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
      isLoading: true,
      accessToken: undefined,
      isAuthenticated: false,
      refreshToken: Cookies.get('refresh_token'),
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
