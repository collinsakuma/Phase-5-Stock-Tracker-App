import { useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import Chart from 'react-apexcharts';

const API = "https://financialmodelingprep.com/api/v3/"
const today = new Date().toISOString().slice(0, 10); // Get today's date in "YYYY-MM-DD" format
const fiveDaysAgo = new Date();
fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5); // Subtract two days from the current date
const fiveDaysAgoFormatted = fiveDaysAgo.toISOString().slice(0, 10); // Get the date of two days ago in "YYYY-MM-DD" format

// chart formating
const chart = {
    options: {
        chart: {
        type: 'candlestick',
        height: 350
      },
      title: {
        text: 'CandelStick Chart',
        align: 'left'
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled:true
        }
      }
    },
  };

function WatchListCardClosed({ watchedStock, handleRemoveFromWatchList }) {
    // get stock information from holding through its table relationship
    const stock = watchedStock.stock;
    const stockTicker = stock.ticker.toUpperCase()

    const [series, setSeries] = useState([{
        data: []
    }]);

    const [price, setPrice] = useState(0);
    const [companyName, setCompanyName] = useState("");
    const [dollarPriceChange, setDollarPriceChange] = useState(0);
    const [changesPercentage, setChangePercentage] = useState(0);

    // stock one minute price for candle stick chart
    async function getStockPrice() {
        const response = await fetch(`${API}historical-chart/5min/${stockTicker}?apikey=${process.env.REACT_APP_API_KEY}&from=${fiveDaysAgoFormatted}`);
        return response.json();
    }

    // stock real time price for ticker information
    async function getStockQuote() {
        const response = await fetch(`${API}quote/${stockTicker}?apikey=${process.env.REACT_APP_API_KEY}`);
        return response.json();
    }

    useEffect(() => {
        async function getChartData() {
            try {
                const chartData = await getStockPrice();
                // console.log(chartData)
                let dataPrices = []
                for (let i = 0; i < 79; i ++) {
                    dataPrices.push(chartData[i])
                }
                console.log(dataPrices)
                const prices = dataPrices.map((instance, index) => ({
                x: new Date(instance.date),
                y: [chartData[index].open, chartData[index].high, chartData[index].low, chartData[index].close]
            }));
            setSeries([{
                data: prices,
            }]);
            } catch(error) {
                console.log(error)
            }
        }
        getChartData();
    }, []);

    useEffect(() => {
        fetch(`${API}quote/${stockTicker}?apikey=${process.env.REACT_APP_API_KEY}`)
        .then((r) => r.json())
        .then((r) => {
            console.log(r)
            setPrice(r[0].price);
            setCompanyName(r[0].name);
            setDollarPriceChange(r[0].change)
            setChangePercentage(r[0].changesPercentage)
        })
    },[])
    
    return (
        <div>
            <div>
                <h3>{companyName}</h3>
                <div style={{display: "inline-block"}}>
                    <h4>{price.toFixed(2)}</h4>
                    <p style={dollarPriceChange < 0 ? {color:"red"} : {color:"green"}}>{(dollarPriceChange).toFixed(2)}</p>
                    <p style={changesPercentage < 0 ? {color:"red"} : {color:"green"}}>{`(${(changesPercentage).toFixed(2)}%)`}</p>
                </div>
            </div>
            <p>{watchedStock.stock.ticker}</p>
            <Button onClick={() => handleRemoveFromWatchList(watchedStock.id)}>X</Button>
            <Chart options={chart.options} series={series} type="candlestick" width="80%" height={320}/>
        </div>

    )
}
export default WatchListCardClosed;