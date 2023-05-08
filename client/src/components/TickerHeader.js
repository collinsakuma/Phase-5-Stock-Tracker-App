import { useState, useEffect } from 'react';
import Marquee from "react-fast-marquee";

const API = "https://financialmodelingprep.com/api/v3/"

async function getMajorAverages() {
    const response = await fetch(`${API}quote/%5EGSPC,%5EDJI,%5EIXIC?apikey=${process.env.REACT_APP_API_KEY}`);
    return response.json();
}

function TickerHeader() {
    const [sAndP, setSAndP] = useState(0);
    const [sAndPChange, setSAndPChange] = useState(0);
    const [dowJ, setDowJ] = useState(0);
    const [dowJChange, setDowJChange] = useState(0);
    const [nasdaq, setNasdaq] = useState(0);
    const [nasdaqChange, setNasdaqChange] = useState(0);



    useEffect(() => {
        async function fetchMajorAverages() {
            try {
                const averagesData = await getMajorAverages();
                console.log(averagesData);
                setSAndP(averagesData[0].price);
                setSAndPChange(averagesData[0].change);
                setDowJ(averagesData[1].price);
                setDowJChange(averagesData[1].change);
                setNasdaq(averagesData[2].price);
                setNasdaqChange(averagesData[2].change);
            } catch(error) {
                console.log(error);
            }
        }
        fetchMajorAverages();
    },[])

    // return averages with color
    const displayAverage = (averageChange) => {
        if (averageChange > 0) {
            return (
                <p style={{color: "green"}}>&nbsp;&nbsp;⬆&nbsp;{averageChange.toFixed(2)}</p>
            )
        }
        if (averageChange < 0) {
            return (
                <p style={{color: "red"}}>⬇ {averageChange.toFixed(2)}</p>
            )
        }
    }

    return (
        <Marquee>
            <div className="ticker-header" style={{display: "flex"}}>
                <div style={{display: "flex", marginRight:"400px"}}>
                    <p><strong>S&P 500&nbsp;&nbsp;:&nbsp;&nbsp;</strong>{parseFloat(sAndP.toFixed(2)).toLocaleString('en-US')}</p>
                    {displayAverage(sAndPChange)}
                </div>
                <div style={{display: "flex", marginRight:"400px"}}>
                    <p><strong>Dow Jones Industrial&nbsp;&nbsp;:&nbsp;&nbsp;</strong>{parseFloat(dowJ.toFixed(2)).toLocaleString('en-US')}</p>
                    {displayAverage(dowJChange)}
                </div>
                <div style={{display: "flex", marginRight:"400px"}}>
                    <p><strong>NASDAQ&nbsp;&nbsp;:&nbsp;&nbsp;</strong>{parseFloat(nasdaq.toFixed(2)).toLocaleString('en-US')}</p>
                    {displayAverage(nasdaqChange)}
                </div>
            </div>
        </Marquee>
    )
}
export default TickerHeader;