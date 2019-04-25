import React, { Component } from 'react';
import NavBar from './components/navbar'

class App extends Component {
  render() {
   const observer = new PerformanceObserver((list) => {
    console.log('Long Task detected! 🚩️');
    const entries = list.getEntries();
    console.log(entries);
});

observer.observe({entryTypes: ['longtask']});
    return (
      <>
        <NavBar />
      </>
    );
  }
}

export default App;
