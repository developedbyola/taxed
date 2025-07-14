import React from 'react';
import Cookies from 'js-cookie';

type Auth = {
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshToken: string | null;
  accessToken: string | null;
};

type State = {
  auth: Auth;
};

type Action =
  | {
      type: 'LOGIN';
      payload: { auth: Pick<Auth, 'accessToken' | 'refreshToken'> };
    }
  | { type: 'LOGOUT' }
  | {
      type: 'SET_TOKENS';
      payload: { auth: Pick<Auth, 'accessToken' | 'refreshToken'> };
    };

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
          refreshToken: action.payload.auth.refreshToken,
          accessToken: action.payload.auth.accessToken,
        },
      };
    case 'SET_TOKENS':
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
          refreshToken: action.payload.auth.refreshToken,
          accessToken: action.payload.auth.accessToken,
        },
      };
    case 'LOGOUT':
      Cookies.remove('refresh_token');
      return {
        ...state,
        auth: {
          isLoading: false,
          refreshToken: null,
          accessToken: null,
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
      isLoading: true,
      accessToken: null,
      isAuthenticated: false,
      refreshToken: Cookies.get('refresh_token') || null,
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
