import { Menu, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

function Navbar({ handleLogout }) {
    return (
        <Menu>
            <Menu.Item name="Home">
                <NavLink exact to='/'>Home</NavLink>
            </Menu.Item>
            <Menu.Item name="Watchlist">
                <NavLink exact to='/watchlist'>Watchlist</NavLink>
            </Menu.Item>
            <Menu.Item>
                <NavLink exact to='/holdings'>Holdings</NavLink>
            </Menu.Item>
            <Menu.Item>
                <NavLink exact to='/update_portfolio'>Update Portfolio</NavLink>
            </Menu.Item>
            <Menu.Item>
                <NavLink exact to='/transactions'>Transactions</NavLink>
            </Menu.Item>
            <Menu.Item>
                <Button onClick={handleLogout}>Logout</Button>
            </Menu.Item>
        </Menu>
    )
}

export default Navbar;