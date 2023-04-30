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

    async function getStockPrice() {
        const response = await fetch(`${API}historical-chart/1min/${stockTicker}?apikey=${process.env.REACT_APP_API_KEY}&from=${today}`);
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

    return (
        <div>
            <p>start to build out charts {stock.ticker}</p>
            <Chart options={chart.options} series={series} type="candlestick" width="80%" height={320}/>
        </div>
    )
}
export default HoldingCard;