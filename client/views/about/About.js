import React from 'react';
import Layout from '../../components/Layout';

class About extends React.Component {
  componentDidMount() {
    document.title = 'About Mirror';
  }

  render() {
    return (
      <Layout>
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--6-col">
            <h1 className="mdl-typography--title">About Mirror</h1>
            <p className="mdl-typography--body-1">
              Coming soon.
            </p>
          </div>
          <div className="mdl-cell mdl-cell--6-col">
            <h1 className="mdl-typography--title">Mirror Stuff</h1>
            <p className="mdl-typography--body-1">
              This mirror is the most awesome mirror ever.
            </p>
          </div>
        </div>
      </Layout>
    );
  }
}

export default About;
