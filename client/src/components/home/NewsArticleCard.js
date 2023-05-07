
function NewsArticleCard({ article }) {
    return (
        <div style={{display:"flex"}}>
            <div>
                <img src={article.image}></img>
            </div>
            <div>
                <div style={{opacity: "50%"}}>
                    <p>Article From: {article.site}</p>
                </div>
                <a className="articles-link" href={article.url} target="_blank">{article.title}</a>
                <p>{article.text}</p>
            </div>
        </div>
    )
}
export default NewsArticleCard;