import React, { Component } from 'react';
import { View, WebView, Platform, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import WebViewBridge from 'react-native-webview-bridge';

export default class DisplayHTML extends Component {

    static propTypes () {
        return {
            htmlString: PropTypes.string.isRequired,
            onMessage: PropTypes.func,
            additionalScripts: PropTypes.array,
            title: PropTypes.string,
            style: ViewPropTypes ? ViewPropTypes.style : WebView.propTypes.style,
            containerStyle: ViewPropTypes ? ViewPropTypes.style : View.propTypes.style,
            HTMLStyles: PropTypes.string,
            defaultHeight: PropTypes.number,
            additionalHeight: PropTypes.number,
            bodyClass: PropTypes.string
        };
    };

    static defaultProps = {
        title: `react-native-display-html-${Date.now()}`,
        scrollEnabled: false,
        defaultHeight: 100,
        additionalHeight: 0,
        containerStyle: {},
        style: {},
        bodyClass: ''
    };

    constructor (props) {
        super(props);
        this.state = {
            height: props.defaultHeight + props.additionalHeight
        };
        this.onMessage = this.onMessage.bind(this);
        this.additionalScripts = [this.heightScript];
        if (props.additionalScripts && props.additionalScripts.length) {
            this.additionalScripts = this.additionalScripts.concat(props.additionalScripts);
        }
        this._buildAdditionalScripts();
    }

    get HTMLSource () {
        return `
            <!DOCTYPE html>
            <title>${this.props.title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <html>${this.HTMLStyles}
            <body class="${this.props.bodyClass}">
                ${this.props.htmlString}
            </body>
            </html>`;
    }

    get HTMLStyles () {
        return this.props.HTMLStyles ? `<style>${this.props.HTMLStyles}</style>` : '';
    }

    get source () {
        let source = { html: this.HTMLSource };

        if (Platform.OS === 'android' && Platform.Version > 18) {
            // Allows loading assets such as fonts from the webview.
            // Setting a baseUrl prevents the HTML from rendering
            // on Android < 4.4.
            // See: https://github.com/facebook/react-native/issues/11753
            // Potential fix: http://bit.ly/2jrH6RC
            source.baseUrl = 'file:///android_asset/';
        }

        return source;
    }

    /**
     * Checks regularly the height of the webview to update the webview
     * accordingly.
     * Note : this isn't transpiled and must be written in ES5 !
     */
    heightScript () {
        function updateHeight () {
            var B = document.body;
            var height;
            if (typeof document.height !== 'undefined') {
                height = document.height;
            } else {
                height = Math.max(B.scrollHeight, B.offsetHeight);
            }
            window.WebViewBridge.send(JSON.stringify({ height: height }));
        }
        if (window.WebViewBridge) {
            updateHeight();
            setInterval(updateHeight, 1000);
        }
    }

    /**
     * Little helper converting functions to plain strings to inject
     * in the webview.
     * @param {function} func
     */
    _stringifyFunc (func) {
        return `(${String(func)})();`;
    }

    /**
     * Build a single large string with all scripts so it can be injected
     * in the webview.
     */
    _buildAdditionalScripts () {
        this._injectedScripts = '';
        this.additionalScripts.forEach((func) => {
            this._injectedScripts += this._stringifyFunc(func);
        });
    }

    /**
     * Callback when the bridge sends a message back to react-native.
     * It updates the webview's height if the payload contains the
     * 'height' key. Else, it fires this.props.onMessage.
     * @param {object} event
     */
    onMessage (event) {
        const { additionalHeight, onMessage } = this.props;
        const eventData = JSON.parse(event);
        const { height } = eventData;

        if (height) {
            let newHeight = height;
            if (!this._additionalHeightInjected) {
                newHeight += additionalHeight;
                this._additionalHeightInjected = true;
            }
            this.setState({ height: newHeight });
        } else {
            return onMessage && onMessage(eventData);
        }
    }

    render () {
        const { style, containerStyle } = this.props;

        return (
            <View style={containerStyle}>
                <WebViewBridge
                  {...this.props}
                  injectedJavaScript={this._injectedScripts}
                  style={[style, { height: this.state.height }]}
                  source={this.source}
                  onBridgeMessage={this.onMessage}
                />
            </View>
        );
    }
}
