import './App.css';
import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Chat from './Chat';
import Login from './Login';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { useAuth } from '../providers/auth';

function App() {
  const { user } = useAuth();

  return (
    <div className="app">
      {!user.uid ? (
        <Login/>
      ):(
        <div className="app__body">
          <Router>
            <Sidebar/>

            <Switch>
              <Route path='/rooms/:roomId'>
                <Chat />
              </Route>

              <Route path='/'>
                {/* chat */}
              </Route>            
            
            </Switch>
          </Router>
      </div>
      )}
    </div>
  );
}

export default App;
