import { Button, Form, Label } from 'semantic-ui-react';
import { useState, useEffect } from 'react'

const API = "https://financialmodelingprep.com/api/v3/"

function UpdatePortfolio({ user }) {
    const [newOrUpdate, setNewOrUpdate] = useState(true);
    const [ticker, setTicker] = useState("");
    const [foundStock, setFoundStock] = useState([]);
    const [companyName, setCompanyName] = useState("");
    const [quote, setQuote] = useState([])
    const [quantity, setQuantity] = useState(0)
    const [stockId, setStockId] = useState(0)
    const [canSubmit, setCanSubmit] = useState(true)

    // check if form has valid quote and quanity entered before allowing form submission
    useEffect(() => {
        if (quote > 0 && quantity > 0) {
            setCanSubmit(false)
        }
    },[quote, quantity])

    // Add form information and post stock to Stocks table
    const handleTickerSearch = (e) => {
        e.preventDefault();
        fetch(`${API}quote/${ticker}?apikey=${process.env.REACT_APP_API_KEY}`)
            .then((r) => r.json())
            .then(setFoundStock)
    }
    useEffect(() => {
        if (foundStock.length !== 0) {
            setCompanyName(foundStock[0].name);
            setQuote(foundStock[0].price)
            let newStock = {
                ticker: `${(foundStock[0].symbol.toLowerCase())}`,
                company_name: `${foundStock[0].name}`,
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
                if (!r.ok) {
                    fetch('/stocks')
                        .then((r) => r.json())
                        .then((r) => {
                            const matchingStock = r.find((stock) => stock.ticker === ticker.toLowerCase())
                            setStockId(matchingStock.id)
                        })
                }
                return r.json();
            })
            // if the stock does not exist in the db it will return the response and setStockId to the response.id
            .then((r) => {
                setStockId(r.id)
            })
        }
    },[foundStock])

    const handleAddStock = (e) => {
        e.preventDefault();
        let newTransaction = {
            // user state passed down from App
            user_id: user.id,
            stock_id: stockId,
            quantity: quantity,
            bought_total: (quantity * quote),
            sold_total: 0 
        }
        fetch('/transactions', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTransaction)
        })
        // update an existing OwnedStock if user already owns stock or create new OwnedStock instance
        fetch(`/stocks_by_user_id`)
        .then((r) => r.json())
        .then((r) => {
            let ownedStock = r.find((stock) => stock.id === stockId)
            if (ownedStock !== undefined) {
                let update = {
                    quantity: parseFloat(ownedStock.quantity) + parseFloat(quantity),
                    total_cost: ownedStock.total_cost + (quantity * quote)
                }
                fetch(`/owned_stocks/${ownedStock.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(update)
                })
            }
            if (ownedStock === undefined) {
                let newOwnedStock = {
                    user_id: user.id,
                    stock_id: stockId,
                    quantity: quantity,
                    total_cost: (quantity * quote)
                }
                fetch('/owned_stocks', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newOwnedStock)
                })
            }
        })
    }
    return (
        <div>
            <Button onClick={() => setNewOrUpdate(true)}>Buy</Button>
            <Button onClick={() => setNewOrUpdate(false)}>Sell</Button>
            <div>
                {newOrUpdate ? (
                    <>
                        <Form onSubmit={handleTickerSearch}>
                            <Form.Field>
                                <Form.Input 
                                    name="ticker"
                                    type="text"
                                    value={ticker.toUpperCase()}
                                    onChange={(e) => setTicker(e.target.value)}
                                    placeholder="ticker"
                                />
                            </Form.Field>
                            <Button type="submit">Search</Button>
                        </Form>
                        <Form onSubmit={handleAddStock}>
                            <Form.Field>
                                <Form.Input 
                                    name="company"
                                    type="text"
                                    value={companyName}
                                    placeholder="Company Name"
                                    readOnly
                                />
                            </Form.Field>
                            <Form.Field>
                                <Label>Share Price</Label>
                                <Form.Input 
                                    name="quote"
                                    type="number"
                                    value={quote}
                                    onChange={(e) => setQuote(e.target.value)}
                                    placeholder="Share Price"
                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.Input
                                    name="quantity"
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="Share Quantity"
                                />
                            </Form.Field>
                            <Form.Field>
                                <Label>Total Price</Label>
                                <Form.Input 
                                    name="totalCost"
                                    type="string"
                                    value={`$ ${(quantity * quote).toFixed(2)}`}
                                    placeholder="Total Cost"
                                    readOnly
                                />
                            </Form.Field>
                            <Button type="submit" disabled={canSubmit}>
                                Add Stock
                            </Button>
                        </Form>
                    </>
                ) : (
                    <>
                        <p>update position</p>
                    </>
                )
            }
        </div>
    </div>
    )
}
export default UpdatePortfolio;