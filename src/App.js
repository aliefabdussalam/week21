import { Component } from 'react';
import Router from './router/index'
import { BrowserRouter} from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './redux/store';

class App extends Component {
  render(){
    return (
      <div className="App">
        <Provider store={store}>
          <BrowserRouter>
            <Router/>
          </BrowserRouter>
        </Provider> 
      </div>
    );
  }
}

export default App;