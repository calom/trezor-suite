/* @flow */

import * as React from 'react';
import styled from 'styled-components';
import colors from 'config/colors';
import { SCREEN_SIZE } from 'config/variables';
import { SLIDE_RIGHT, SLIDE_LEFT } from 'config/animations';


type Props = {
    children?: React.Node,
    isOpen: boolean,
}

type State = {
    footerFixed: boolean,
}

const AbsoluteWrapper = styled.aside`
    width: 320px;
    position: relative;
    overflow-y: auto;

    background: ${colors.MAIN};
    border-top-left-radius: 4px;
    border-right: 1px solid ${colors.DIVIDER};

    @media screen and (max-width: ${SCREEN_SIZE.SM}) {
        position: absolute;
        height: calc(100% - 52px);
        z-index: 200;
        top: 52px;
        animation: ${props => (props.isOpen ? SLIDE_RIGHT : SLIDE_LEFT)} 0.25s cubic-bezier(0.17, 0.04, 0.03, 0.94) forwards;
    }

    @media screen and (max-width: ${SCREEN_SIZE.LG}) {
        border-top-left-radius: 0px;
    }

`;

const MobileSidebarWrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
`;

export default class MobileSidebar extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            footerFixed: false,
        };
    }

    render() {
        return (
            <AbsoluteWrapper isOpen={this.props.isOpen}>
                <MobileSidebarWrapper>
                    {React.Children.map(this.props.children, (child) => { // eslint-disable-line arrow-body-style
                        return child.key === 'sticky-footer' ? React.cloneElement(child, {
                            position: this.state.footerFixed ? 'fixed' : 'relative',
                        }) : child;
                    })}
                </MobileSidebarWrapper>
            </AbsoluteWrapper>
        );
    }
}