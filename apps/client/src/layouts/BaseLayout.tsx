import {
  ChakraProvider,
  defineConfig,
  defaultConfig,
  mergeConfigs,
  createSystem,
} from '@chakra-ui/react';
import Home from '@/routes/Home';
import { Auth } from '@/features/auth';
import { User } from '@/features/users';
import { LoginRoute } from '@/routes/Login';
import { RegisterRoute } from '@/routes/Register';
import { AppHomeRoute } from '@/routes/app/AppHome';
import { ProtectedLayout } from './ProtectedLayout';
import { Transactions } from '@/features/transactions';
import { AppPayListRoute } from '@/routes/app/AppPayList';
import { AppPayItemRoute } from '@/routes/app/AppPayItem';
import TransactionsRoute from '@/routes/app/Transactions';
import { Routes, Route, BrowserRouter } from 'react-router';
import { DialogProvider, DialogRenderer, TrpcProvider } from '@/components';
import SettingsRoute from '@/routes/app/Settings';
import { HelmetProvider } from 'react-helmet-async';
import SettingsProfile from '@/routes/app/settings/Profile';
import SettingsAccount from '@/routes/app/settings/Account';
import SettingsPassword from '@/routes/app/settings/Password';

const config = mergeConfigs(
  defaultConfig,
  defineConfig({
    theme: {
      textStyles: {},
    },
  })
);
const system = createSystem(config);

const BaseLayout = () => {
  return (
    <ChakraProvider value={system}>
      <BrowserRouter>
        <DialogProvider>
          <Auth.Provider>
            <User.Provider>
              <TrpcProvider>
                <User.Profile>
                  <HelmetProvider>
                    <Routes>
                      <Route
                        path='/'
                        element={<Home />}
                      />
                      <Route
                        path='/login'
                        element={<LoginRoute />}
                      />
                      <Route
                        path='/register'
                        element={<RegisterRoute />}
                      />
                      <Route
                        path='/app'
                        element={
                          <Auth.RefreshToken>
                            <Transactions.Provider>
                              <ProtectedLayout />
                            </Transactions.Provider>
                          </Auth.RefreshToken>
                        }
                      >
                        <Route
                          index
                          element={<AppHomeRoute />}
                        />
                        <Route
                          path='pay'
                          element={<AppPayListRoute />}
                        />
                        <Route
                          path='pay/:taxGroup'
                          element={<AppPayItemRoute />}
                        />
                        <Route
                          path='transactions'
                          element={<TransactionsRoute />}
                        />
                        <Route
                          path='settings'
                          element={<SettingsRoute />}
                        />
                        <Route
                          path='settings/profile'
                          element={<SettingsProfile />}
                        />
                        <Route
                          path='settings/account'
                          element={<SettingsAccount />}
                        />
                        <Route
                          path='settings/password'
                          element={<SettingsPassword />}
                        />
                      </Route>
                    </Routes>
                  </HelmetProvider>
                </User.Profile>
              </TrpcProvider>
            </User.Provider>
          </Auth.Provider>
          <DialogRenderer />
        </DialogProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default BaseLayout;
