import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Button } from 'reactstrap';

export class FacebookLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showFacebookBtn: false
        };
    }
    componentDidMount() {
        document.addEventListener('FBObjectReady', this.initializeFacebookLogin());
    }

    componentWillUnmount() {
        document.removeEventListener('FBObjectReady', this.initializeFacebookLogin());
    }

    /**
     * Init FB object and check Facebook Login status
     */
    initializeFacebookLogin = () => {
        var iterations = 0;
        var interval = setInterval(() => {
            if (window.FB !== undefined) {
                clearInterval(interval);
                this.FB = window.FB;
                this.checkLoginStatus();
            }
            else if (iterations >= 30)
                clearInterval(interval);
            iterations++;
        }, 50);
    }

    /**
     * Check login status
     */
    checkLoginStatus = () => {
        this.setState({
            showFacebookBtn: true
        });
        this.FB.getLoginStatus(this.facebookLoginHandler);
    }

    /**
     * Check login status and call login api is user is not logged in
     */
    facebookLogin = () => {
        if (this.FB === undefined) {
            return;
        }
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
    }

    render() {
        return (
            <div>
                {this.state.showFacebookBtn ?
                    <Button
                        className="facebook"
                        onClick={this.facebookLogin}
                    >
                        <FontAwesome
                            name="facebook-square"
                            size="2x"
                        />
                    </Button>
                    : null}
            </div>
        );
    }
}