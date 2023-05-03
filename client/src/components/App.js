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

const API = "https://financialmodelingprep.com/api/v3/"

function App() {
  const [user, setUser] = useState(null);
  const [isMarketOpen, setIsMarketOpen] = useState(false);

  async function checkMarketOpen() {
    const response = await fetch(`${API}/is-the-market-open?apikey=${process.env.REACT_APP_API_KEY}`);
    return response.json();
  }

  // function to check is the stock market is currently open every 30 seconds
  useEffect(() => {
    let timeoutId;

    async function isOpen() {
      try {
        const market = await checkMarketOpen();
        setIsMarketOpen(market.isTheStockMarketOpen);
      } catch(error) {
        console.log(error);
      }
      timeoutId = setTimeout(isOpen, 20000);
    }
    isOpen();

    return () => {
      clearTimeout(timeoutId);
    }
  },[])


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
            <Watchlist user={user} isMarketOpen={isMarketOpen}/>
          </Route>
          <Route exact path="/holdings">
            <Holdings/>
          </Route>
          <Route exact path="/update_portfolio">
            <UpdatePortfolio user={user}/>
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
