import { Menu, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

function Navbar({ handleLogout, user }) {
    return (
        <Menu className='navbar-nav'>
            <Menu.Item name="Home" style={{marginLeft:"10%"}}>
                <NavLink className='navbar' exact to='/'>Home</NavLink>
            </Menu.Item>
            <Menu.Item name="Watchlist">
                <NavLink className='navbar' exact to='/watchlist'>Watchlist</NavLink>
            </Menu.Item>
            <Menu.Item>
                <NavLink className='navbar' exact to='/holdings'>Holdings</NavLink>
            </Menu.Item>
            <Menu.Item>
                <NavLink className='navbar' exact to='/update_portfolio'>Update Portfolio</NavLink>
            </Menu.Item>
            <Menu.Item>
                <NavLink className='navbar' exact to='/transactions'>Transactions</NavLink>
            </Menu.Item>
            <Menu.Item>
                <NavLink className='navbar' exact to='/senate_trading'>U.S. Rep. Trading</NavLink>
            </Menu.Item>
            <Menu.Menu position="right">
                <Menu.Item position="right">
                    <p>Hello,&nbsp;&nbsp;{user.username}</p>
                </Menu.Item>
                <Menu.Item position="right">
                    <Button onClick={handleLogout}>Logout</Button>
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    )
}

export default Navbar;