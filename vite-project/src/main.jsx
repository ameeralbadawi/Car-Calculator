import React from 'react';
import ReactDOM from 'react-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Subscribe from './Subscribe'; // Make sure to create this component
import store from './store';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk publishable key in VITE_CLERK_PUBLISHABLE_KEY");
}

ReactDOM.render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
          <Route
            path="/subscribe"
            element={
              <>
                <SignedIn>
                  <Subscribe />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </Router>
    </Provider>
  </ClerkProvider>,
  document.getElementById('root')
);