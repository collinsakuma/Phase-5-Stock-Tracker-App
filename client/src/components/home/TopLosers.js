import { useState, useEffect } from 'react';

const API = "https://financialmodelingprep.com/api/v3/"

function TopLosers() {
    const [topFiveLosers, setTopFiveLosers] = useState([]);

    useEffect(() => {
        fetch(`${API}stock_market/losers?limit=10&apikey=${process.env.REACT_APP_API_KEY}`)
        .then((r) => r.json())
        .then((r) => {
            // console.log(r)
            let topFive = [];
            for (let i = 0; i < 5; i ++) {
                topFive.push(r[i]);
            }
            setTopFiveLosers(topFive);
        })
    },[])

    const topFiveTable = topFiveLosers.map((stock) => {
        return (
            <tr key={stock.symbol}>
                <td className="table-elements">{stock.symbol}</td>
                <td className="table-elements">{stock.name}</td>
                <td className="table-elements">{(stock.price).toFixed(2)}</td>
                <td className="table-elements" style={{color: "red"}}>⬇{(stock.change).toFixed(2)}</td>
                <td className="table-elements" style={{color: "red"}}>⬇{(stock.changesPercentage).toFixed(2)}</td>
            </tr>
        )
    })

    return (
        <div style={{margin:"75px"}}>
            <h3>Top Losers</h3>
            <table className='table-styles'>
                <thead>
                    <tr>
                        <th className="table-elements-header">Symbol</th>
                        <th className="table-elements-header">Name</th>
                        <th className="table-elements-header">Price</th>
                        <th className="table-elements-header">Price change</th>
                        <th className="table-elements-header">% Change</th>
                    </tr>
                </thead>
                <tbody>
                    {topFiveTable}
                </tbody>
            </table>
        </div>
        
    )
}
export default TopLosers;