import { useEffect } from 'react';

function NewsFeed() {
    const API = "https://financialmodelingprep.com/api/v3/"
    
    async function getStockNews() {
        const response = await fetch(`${API}stock_news?apikey=${process.env.REACT_APP_API_KEY}`);
        return response.json()
    }

    useEffect(() => {
        async function fetchStockNews() {
            try {
                const stockNews = await getStockNews();
                console.log(stockNews)
            } catch(error) {
                console.log(error);
            }
        }
    })
    
    return (
        <div>news feed</div>
    )
}
export default NewsFeed;