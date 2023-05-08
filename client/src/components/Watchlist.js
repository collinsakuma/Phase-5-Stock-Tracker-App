import WatchListCardOpen from "./WatchListCardOpen";
import { Button, Form, Label, Card } from 'semantic-ui-react';
import { useState, useEffect } from "react";
import WatchListCardClosed from './WatchListCardClosed';

const API = "https://financialmodelingprep.com/api/v3/"

function Watchlist({ user, isMarketOpen }) {
    const [ticker, setTicker] = useState("");
    const [watchedStocksArray, setWatchedStocksArray] = useState([]);

    const handleAddStockToWatchList = (e) => {
        e.preventDefault();
        fetch(`${API}quote/${ticker}?apikey=${process.env.REACT_APP_API_KEY}`)
            .then((r) => r.json())
            .then((r) => {
                let newStock = {
                    ticker: `${(r[0].symbol.toLowerCase())}`,
                    company_name: `${r[0].name}`,
                    price: 0
                }
                fetch('/stocks', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newStock),
                })
                .then((r) => {
                    // if the stock already exist in the db it will fetch the id of that stock using the ticker set in state
                        fetch('/stocks')
                            .then((r) => r.json())
                            .then((r) => {
                                const matchingStock = r.find((stock) => stock.ticker === ticker.toLowerCase())
                                
                                let newWatchedStock = {
                                    user_id: user.id,
                                    stock_id: matchingStock.id
                                }

                                
                                fetch('/watched_stocks', {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(newWatchedStock)
                                })
                                .then(() => {
                                    fetch('/watched_stocks_by_user')
                                        .then((r) => r.json())
                                        .then(setWatchedStocksArray)
                                })
                            })

                    return r.json();
                })
            })
    }

    useEffect(() => {
        fetch('/watched_stocks_by_user')
        .then((r) => r.json())
        .then(setWatchedStocksArray)
    },[])

    const handleRemoveFromWatchList = (watchedStockId) => {
        fetch(`/watched_stocks/${watchedStockId}`, {
            method: "DELETE",
        })
        .then(() => {
            setWatchedStocksArray((prevState) => {
                // filter out the deleted watched stock from the state
                return prevState.filter((watchedStock) => watchedStock.id !== watchedStockId)
            })
        })
    }
    return (
        <div>
            <Form onSubmit={handleAddStockToWatchList}>
                <Form.Field>
                    <Label>Search By Ticker</Label>
                    <Form.Input 
                        name="searchTicker"
                        type="string"
                        value={ticker.toUpperCase()}
                        onChange={(e) => setTicker(e.target.value)}
                    />
                </Form.Field>
                <Button>Add to WatchList</Button>
            </Form>
            <br></br>
            <Card.Group itemsPerRow={1} centered>
                {isMarketOpen ? (
                    watchedStocksArray.map((watchedStock) => (
                        <WatchListCardOpen
                            key={watchedStock.id}
                            watchedStock={watchedStock}
                            handleRemoveFromWatchList={handleRemoveFromWatchList}
                        />
                    ))
                ) : (
                    watchedStocksArray.map((watchedStock) => (
                        <WatchListCardClosed 
                            key={watchedStock.id} 
                            watchedStock={watchedStock}
                            handleRemoveFromWatchList={handleRemoveFromWatchList}
                        />
                    ))
                )}
            </Card.Group>
        </div>
    )
}
export default Watchlist;