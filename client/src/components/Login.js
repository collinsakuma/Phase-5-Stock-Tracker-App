import { useState } from 'react';
import Header from './Header';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import { Button } from 'semantic-ui-react';

function Login({ onLogin }) {
    const [showLogin, setShowLogin] = useState(true);
    return (
        <div>
            <Header />
            <div>
                {showLogin ? (
                    <>
                        <LoginForm onLogin={onLogin} />
                        <p>Don't have an account?</p>
                        <Button onClick={() => setShowLogin(false)}>Sign Up</Button>
                    </>
                ) : (
                    <>
                        <SignUpForm onLogin={onLogin} />
                        <p>Already have an account?</p>
                        <Button onClick={() => setShowLogin(true)}>Login</Button>
                    </>
                )}
            </div>
        </div>
    )
}
export default Login;