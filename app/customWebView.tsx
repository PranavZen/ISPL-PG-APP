import React from 'react';
import { requireNativeComponent, NativeModules } from 'react-native';
import WebView, { WebViewProps } from 'react-native-webview';
import { WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';

const { CustomWebViewManager } = NativeModules;

interface CustomWebViewProps extends WebViewProps {
  finalUrl?: string;
  onNavigationCompleted?: (event: WebViewNavigationEvent) => void;
}

export default class CustomWebView extends React.Component<CustomWebViewProps> {
  static defaultProps = {
    finalUrl: 'about:blank',
  };

  // Handler for navigation completion
  _onNavigationCompleted = (event: WebViewNavigationEvent) => {
    const { onNavigationCompleted } = this.props;
    if (onNavigationCompleted) {
      onNavigationCompleted(event);
    }
  };

  render() {
    return (
      <WebView
        {...this.props}
        nativeConfig={{
          component: RCTCustomWebView,
          props: {
            finalUrl: this.props.finalUrl,
            onNavigationCompleted: this._onNavigationCompleted,
          },
          viewManager: CustomWebViewManager,
        }}
      />
    );
  }
}

// Require the native component for the custom WebView
const RCTCustomWebView = requireNativeComponent<CustomWebViewProps>('RCTCustomWebView', CustomWebView);
