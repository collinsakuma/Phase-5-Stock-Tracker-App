import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';


const API = "https://financialmodelingprep.com/api/v3/"
const today = new Date().toISOString().slice(0, 10);

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

function HoldingCard({ holding }) {
    // get stock information from holding through its table relationship
    const stock = holding.stock;
    const stockTicker = stock.ticker.toUpperCase()

    const [series, setSeries] = useState([{
        data: []
    }]);

    const [price, setPrice] = useState(0);
    const [open, setOpen] = useState(0);

    // stock one minute price for candle stick chart
    async function getStockPrice() {
        const response = await fetch(`${API}historical-chart/1min/${stockTicker}?apikey=${process.env.REACT_APP_API_KEY}&from=${today}`);
        return response.json();
    }

    // stock real time price for ticker information
    async function getStockQuote() {
        const response = await fetch(`${API}quote/${stockTicker}?apikey=${process.env.REACT_APP_API_KEY}`);
        return response.json();
    }

    useEffect(() => {
        let timeoutId;
      
        async function getChartData() {
            try {
                const chartData = await getStockPrice();
                // console.log(chartData)
                const prices = chartData.map((instance, index) => ({
                x: new Date(instance.date),
                y: [chartData[index].open, chartData[index].high, chartData[index].low, chartData[index].close]
            }));
            setSeries([{
                data: prices,
            }]);
            } catch(error) {
                console.log(error)
            }
            timeoutId = setTimeout(getChartData, 60000);
        }
      
        getChartData();
      
        // Cleanup function
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    useEffect(() => {
      let timeoutId;

      async function getCurrentPrice() {
        try {
          const stockData = await getStockQuote();
          setPrice(stockData[0].price.toFixed(2));
          setOpen(stockData[0].open)
        } catch(error) {
          console.log(error);
        }
        timeoutId = setTimeout(getCurrentPrice, 3000);
      }
      getCurrentPrice();

      return () => {
        clearTimeout(timeoutId);
      }
    },[])

    return (
        <div>
            <p>start to build out charts {stock.ticker}</p>
            <Chart options={chart.options} series={series} type="candlestick" width="80%" height={320}/>
            {/* <p style={price > prevPrice ? {color:"green"} : {color: "red"}}>{price}</p> */}
            <div style={price > open ? {color:"green"} : {color: "red"}}>
              {price}
            </div>
            <p>{open}</p>
        </div>
    )
}
export default HoldingCard;
