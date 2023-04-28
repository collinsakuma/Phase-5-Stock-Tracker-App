import { useState, useEffect } from "react";
import HoldingCard from "./HoldingCard";

function Holdings() {
    const [userStocks, setUserStocks] = useState([])

    useEffect(() => {
        fetch(`/stocks_by_user_id`)
            .then((r) => r.json())
            .then(setUserStocks)
    },[])
    
    return (
        <div>
            {userStocks.map((holding) => <HoldingCard key={holding.id} holding={holding}/>)}
        </div>
    )
}
export default Holdings;