import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Paper } from "@material-ui/core";
import { Link, Route, BrowserRouter, Switch } from "react-router-dom";
import Tree from "./tree"

class NavBar extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    if (this.state.value !== value) {
      this.setState({ value });
    }
  };

  handleChangeIndex = index => {
    if (this.state.value !== index) {
      this.setState({ value: index });
    }
  };

  render() {
    return (
      <BrowserRouter>
        <div>
          <AppBar position="static">
            <Tabs
              value={this.state.value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="inherit"
            >
              <Tab label="Tree" component={Link} to="/tree" />
              <Tab label="Skills" component={Link} to="/skills" />
            </Tabs>
          </AppBar>
          <Switch>
            <Route path="/tree" component={PageShell(Tree)} />
            <Route path="/skills" component={PageShell(Skills)} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}


function Skills(theme) {
  return (
    <Paper>
      <div>Skillllsssss</div>
    </Paper>
  );
}

const PageShell = (Page, previous) => {
  return props => (
    <div className="page">
      <Page {...props} />
    </div>
  );
};
export default NavBar;
