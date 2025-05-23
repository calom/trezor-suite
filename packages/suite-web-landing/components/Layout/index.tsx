import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Translation from '../Translation';
import { TrezorLogo, Button, colors, variables, Link } from '@trezor/components';

const Layout = styled.div`
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
    padding: 0 20px;
    background: ${colors.BG_WHITE};
`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 28px 0 10px 0;

    @media only screen and (min-width: ${variables.SCREEN_SIZE.MD}) {
        align-items: flex-start;
    }
`;

const Content = styled.div`
    margin: 88px 0 0 0;
`;

const Footer = styled.footer`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e8e8e8;
    padding: 60px 20px 100px 20px;
    text-align: center;

    @media only screen and (min-width: ${variables.SCREEN_SIZE.MD}) {
        flex-direction: row;
        align-items: flex-start;
        padding: 60px 53px 100px 125px;
        text-align: left;
    }
`;

const FooterList = styled.div`
    & + & {
        margin-top: 40px;
    }
    @media only screen and (min-width: ${variables.SCREEN_SIZE.MD}) {
        & + & {
            margin-top: 0px;
            margin-left: 107px;
        }
    }
`;

const FooterLinks = styled.div`
    display: flex;
    flex-direction: column;

    @media only screen and (min-width: ${variables.SCREEN_SIZE.MD}) {
        flex-direction: row;
    }
`;

const FooterHeadline = styled.h3`
    font-size: ${variables.FONT_SIZE.NORMAL};
    font-weight: bold;
    margin-bottom: 15px;
`;

const FooterLink = styled(Link)`
    && {
        display: block;
        font-size: ${variables.FONT_SIZE.TINY};
        & + & {
            margin-top: 11px;
        }
    }
`;

const FooterCompany = styled.div`
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    margin-top: 40px;

    @media only screen and (min-width: ${variables.SCREEN_SIZE.MD}) {
        text-align: right;
        align-items: flex-end;
        margin-top: 0;
    }
`;

const FooterParagraph = styled.p`
    font-size: ${variables.FONT_SIZE.TINY};
    margin-top: 17px;
    & a {
        text-decoration: underline;
    }
`;

interface Props {
    children: ReactNode;
    pathToApp: string;
}

const Index = ({ children, pathToApp }: Props) => (
    <Layout>
        <Header>
            <TrezorLogo type="suite" width={185} />
            <Link variant="nostyle" href={`${pathToApp}/`}>
                <Button
                    variant="tertiary"
                    icon="EXTERNAL_LINK"
                    alignIcon="right"
                    color={colors.TYPE_DARK_GREY}
                >
                    <Translation id="TR_SUITE_WEB_LANDING_SUITE_ON_WEB" />
                </Button>
            </Link>
        </Header>
        <Content>{children}</Content>
        <Footer>
            <FooterLinks>
                <FooterList>
                    <FooterHeadline>
                        <Translation id="TR_SUITE_WEB_LANDING_FOOTER_HEADLINE_2" />
                    </FooterHeadline>
                    <FooterLink href="https://blog.trezor.io/">
                        <Translation id="TR_SUITE_WEB_LANDING_FOOTER_BLOG" />
                    </FooterLink>
                    <FooterLink href="https://github.com/orgs/trezor/projects/28?fullscreen=true">
                        <Translation id="TR_SUITE_WEB_LANDING_FOOTER_ROADMAP" />
                    </FooterLink>
                </FooterList>
            </FooterLinks>
            <FooterCompany>
                <TrezorLogo type="horizontal" width="83px" />
                <FooterParagraph>
                    <Translation
                        id="TR_SUITE_WEB_LANDING_FOOTER_HEADLINE_PARAGRAPH"
                        values={{
                            a: chunks => <Link href="https://trezor.io/">{chunks}</Link>,
                        }}
                    />
                </FooterParagraph>
            </FooterCompany>
        </Footer>
    </Layout>
);

export default Index;
