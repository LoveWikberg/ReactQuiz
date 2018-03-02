import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Button } from 'reactstrap';

export class FacebookLogin extends React.Component {

    componentDidMount() {
        alert("componentDidMount Facebook");
        document.addEventListener('FBObjectReady', this.initializeFacebookLogin());
    }

    componentWillUnmount() {
        alert("componentWillUnmount Facebook");
        document.removeEventListener('FBObjectReady', this.initializeFacebookLogin());
    }

    /**
     * Init FB object and check Facebook Login status
     */
    initializeFacebookLogin = () => {
        alert("initializeFacebookLogin");
        this.FB = window.FB;
        this.checkLoginStatus();
    }

    /**
     * Check login status
     */
    checkLoginStatus = () => {
        this.FB.getLoginStatus(this.facebookLoginHandler);
    }

    /**
     * Check login status and call login api is user is not logged in
     */
    facebookLogin = () => {
        alert("clicked");
        if (!this.FB) return;
        alert("FB is defined");
        this.FB.getLoginStatus(response => {
            if (response.status === 'connected') {
                this.facebookLoginHandler(response);
            } else {
                this.FB.login(this.facebookLoginHandler, { scope: 'public_profile' });
            }
        }, );
    }

    /**
     * Handle login response
     */
    facebookLoginHandler = (response) => {
        if (response.status === 'connected') {
            this.FB.api('/me', userData => {
                let result = {
                    ...response,
                    user: userData
                };
                this.props.onLogin(true, result);
            });
        } else {
            this.props.onLogin(false);
        }
    }

    onFacebookLogin = (loginStatus, resultObject) => {
        console.log(resultObject);
        if (loginStatus === true) {
            alert('Facebook login success');
        } else {
            alert('Facebook login error');
        }
    }

    render() {
        return (
            <div>
                <Button
                    className="facebook"
                    onClick={this.facebookLogin}
                >
                    <FontAwesome
                        name="facebook-square"
                        size="2x"
                    />
                </Button>
            </div>
        );
    }
}