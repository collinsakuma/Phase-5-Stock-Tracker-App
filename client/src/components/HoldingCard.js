
function HoldingCard({ holding }) {
    // get stock information from holding through its table relationship
    const stock = holding.stock;
    return (
        <div>
            <p>start to build out charts {stock.ticker}</p>
        </div>
    )
}
export default HoldingCard;