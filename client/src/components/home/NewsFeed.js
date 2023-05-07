import { useState, useEffect } from 'react';
import NewsArticleCard from './NewsArticleCard';

const API = "https://financialmodelingprep.com/api/v3/"

function NewsFeed() {
    const [newsArticles, setNewsArticles] = useState([]);
    const [userStocks, setUserStocks] = useState("");
    
    useEffect(() => {
        fetch('/stocks_by_user_id')
        .then((r) => r.json())
        .then((r) => {
            let array = [];
            r.map((holding) => {
                array.push(holding.stock.ticker.toUpperCase());
            })
            setUserStocks(array.toString());
        })
    },[])

    useEffect(() => {
        fetch(`${API}stock_news?tickers=${userStocks}&limit=10&apikey=${process.env.REACT_APP_API_KEY}`)
          .then((r) => r.json())
          .then((data) => {
            const uniqueArticles = filterDuplicateArticles(data);
            setNewsArticles(uniqueArticles);
          })
          .catch((error) => {
            console.error(error);
          });
      }, [userStocks]);
      
      function filterDuplicateArticles(articles) {
        const uniqueTitles = new Set();
        return articles.filter((article) => {
          if (uniqueTitles.has(article.title)) {
            return false;
          }
          uniqueTitles.add(article.title);
          return true;
        });
      }
    return (
        <div>
            {newsArticles.map((article) => <NewsArticleCard key={article.publishedDate} article={article}/>)}
        </div>
    )
}
export default NewsFeed;