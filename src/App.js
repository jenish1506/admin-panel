import React from 'react';
import Layout from './Components/Layout';
import { Switch, Route, Redirect } from 'react-router-dom';
import Medicine from './Containers/Medicine';
import Patients from './Containers/Patients';

const App = () => {
  return (
    <>
      <Layout >
        <Switch>
          <Route exact path="/medicine" component={Medicine} />
          <Route exact path="/patient" component={Patients} />
          <Redirect to="/medicine" />
        </Switch>
      </Layout>
    </>
  )
}

export default App