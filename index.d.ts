// typings for react-native-display-html

import * as React from 'react';
import * as ReactNative from 'react-native';

interface ComponentProps extends React.Props<DisplayHTML, {}> {
    htmlString: string;
    onMessage?: Function;
    additionalScripts?: Array<Function>;
    title?: string;
    style?: ReactNative.ViewStyle;
    containerStyle?: ReactNative.ViewStyle;
    HTMLStyles?: string;
    defaultHeight?: number;
    additionalHeight?: number;
    bodyClass?: string;
}

export class DisplayHTML extends React.Component<ComponentProps, {}> {

}
