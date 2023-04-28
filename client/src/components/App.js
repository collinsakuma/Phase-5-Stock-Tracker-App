import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./Login";
import Header from "./Header";
import Navbar from "./Navbar";
import Homepage from "./Homepage";
import Watchlist from "./Watchlist";
import Holdings from "./Holdings";
import UpdatePortfolio from "./UpdatePortfolio";
import Transactions from "./Transactions";

console.log(process.env.REACT_APP_API_KEY)

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch("/check_session")
      .then((r) => {
        if (r.ok) {
          r.json().then((user) => setUser(user));
        }
      });
  }, []);

  const handleLogout = () => {
    fetch("/logout", {method: "DELETE"})
      .then((r) => {
        if (r.ok) {
          setUser(null)
        }
      })
  }
  
  if (!user) return <Login onLogin={setUser} />;

  return (
    <div>
      <div>
        <Header />
        <Navbar handleLogout={handleLogout}/> 
      </div>
      <div>
        <Switch>
          <Route exact path="/">
            <Homepage />
          </Route>
          <Route exact path="/watchlist">
            <Watchlist />
          </Route>
          <Route exact path="/holdings">
            <Holdings />
          </Route>
          <Route exact path="/update_portfolio">
            <UpdatePortfolio />
          </Route>
          <Route exact path="/transactions">
            <Transactions />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default App;
