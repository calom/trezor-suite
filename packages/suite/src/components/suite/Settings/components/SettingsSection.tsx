import React, { ReactNode, ReactElement } from 'react';
import styled from 'styled-components';
import Card from '@suite-components/Card';
import { variables, P } from '@trezor/components';

const Wrapper = styled.div`
    margin-bottom: 40px;
`;

const Header = styled.div`
    padding: 4px 12px 12px 0;
    margin-bottom: 12px;
`;

const Title = styled.div`
    font-size: ${variables.FONT_SIZE.TINY};
    color: ${props => props.theme.TYPE_LIGHT_GREY};
    text-transform: uppercase;
    font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};
`;

const Description = styled(P)`
    margin-top: 4px;
`;

const Content = styled(Card)`
    flex-direction: column;
`;

interface SettingsSectionProps {
    customHeader?: ReactNode | ReactElement;
    title?: string | ReactElement;
    description?: string | ReactElement;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
    children,
    title,
    description,
    customHeader,
}) => (
    <Wrapper>
        <Header>
            {!title && customHeader}
            {title && !customHeader && <Title>{title}</Title>}
            {description && !customHeader && <Description size="tiny">{description}</Description>}
        </Header>

        <Content largePadding noVerticalPadding noPadding>
            {children}
        </Content>
    </Wrapper>
);
