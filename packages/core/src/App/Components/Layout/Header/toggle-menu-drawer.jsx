import classNames from 'classnames';
import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Div100vhContainer, Icon, MobileDrawer, ToggleSwitch } from '@deriv/components';
import {
    useOnrampVisible,
    useAccountTransferVisible,
    useIsP2PEnabled,
    usePaymentAgentTransferVisible,
    useFeatureFlags,
} from '@deriv/hooks';
import { routes, PlatformContext, getStaticUrl, whatsapp_url } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import NetworkStatus from 'App/Components/Layout/Footer';
import ServerTime from 'App/Containers/server-time.jsx';
import getRoutesConfig from 'App/Constants/routes-config';
import LiveChat from 'App/Components/Elements/LiveChat';
import useLiveChat from 'App/Components/Elements/LiveChat/use-livechat.ts';
import PlatformSwitcher from './platform-switcher';
import MenuLink from './menu-link';
import { MobileLanguageMenu, MenuTitle } from './Components/ToggleMenu';
import { useRemoteConfig } from '@deriv/api';


const ToggleMenuDrawer = observer(({ platform_config }) => {
    const { common, ui, client, traders_hub, modules } = useStore();
    const { app_routing_history, current_language } = common;
    const {
        disableApp,
        enableApp,
        is_mobile_language_menu_open,
        is_dark_mode_on: is_dark_mode,
        setDarkMode: toggleTheme,
        setMobileLanguageMenuOpen,
    } = ui;
    const {
        account_status,
        is_logged_in,
        is_logging_in,
        is_virtual,
        loginid,
        logout: logoutClient,
        should_allow_authentication,
        should_allow_poinc_authentication,
        landing_company_shortcode: active_account_landing_company,
        is_landing_company_loaded,
        is_proof_of_ownership_enabled,
        is_eu,
    } = client;
    const { cashier } = modules;
    const { payment_agent } = cashier;
    const { is_payment_agent_visible } = payment_agent;
    const { show_eu_related_content, setTogglePlatformType } = traders_hub;
    const is_account_transfer_visible = useAccountTransferVisible();
    const is_onramp_visible = useOnrampVisible();
    const { data: is_payment_agent_transfer_visible } = usePaymentAgentTransferVisible();
    const { data: is_p2p_enabled } = useIsP2PEnabled();

    const liveChat = useLiveChat(false, loginid);
    const [is_open, setIsOpen] = React.useState(false);
    const [transitionExit, setTransitionExit] = React.useState(false);
    const [primary_routes_config, setPrimaryRoutesConfig] = React.useState([]);
    const [is_submenu_expanded, expandSubMenu] = React.useState(false);

    const { is_appstore } = React.useContext(PlatformContext);
    const timeout = React.useRef();
    const history = useHistory();
    const { is_next_wallet_enabled } = useFeatureFlags();

    React.useEffect(() => {
        const processRoutes = () => {
            const routes_config = getRoutesConfig({ is_appstore });
            let primary_routes = [];

            const location = window.location.pathname;

            if (is_appstore) {
                primary_routes = [
                    routes.my_apps,
                    routes.explore,
                    routes.wallets,
                    routes.platforms,
                    routes.trade_types,
                    routes.markets,
                ];
            } else if (location === routes.traders_hub || is_trading_hub_category) {
                primary_routes = [routes.account, routes.cashier];
            } else if (location === routes.wallets || is_next_wallet_enabled) {
                primary_routes = [routes.reports, routes.account];
            } else {
                primary_routes = [routes.reports, routes.account, routes.cashier];
            }
            setPrimaryRoutesConfig(getFilteredRoutesConfig(routes_config, primary_routes));
        };

        if (account_status || should_allow_authentication) {
            processRoutes();
        }

        return () => clearTimeout(timeout.current);
    }, [is_appstore, account_status, should_allow_authentication, is_trading_hub_category, is_next_wallet_enabled]);

    const toggleDrawer = React.useCallback(() => {
        if (is_mobile_language_menu_open) setMobileLanguageMenuOpen(false);
        if (!is_open) setIsOpen(!is_open);
        else {
            setTransitionExit(true);
            timeout.current = setTimeout(() => {
                setIsOpen(false);
                setTransitionExit(false);
            }, 400);
        }
        expandSubMenu(false);
    }, [expandSubMenu, is_open, is_mobile_language_menu_open, setMobileLanguageMenuOpen]);

    const getFilteredRoutesConfig = (all_routes_config, routes_to_filter) => {
        const subroutes_config = all_routes_config.flatMap(i => i.routes || []);

        return routes_to_filter
            .map(path => all_routes_config.find(r => r.path === path) || subroutes_config.find(r => r.path === path))
            .filter(route => route);
    };

    const getRoutesWithSubMenu = (route_config, idx) => {
        const has_access = route_config.is_authenticated ? is_logged_in : true;
        if (!has_access) return null;

        if (!route_config.routes) {
            return (
                <MobileDrawer.Item key={idx}>
                    <MenuLink
                        link_to={route_config.path}
                        icon={route_config.icon_component}
                        text={route_config.getTitle()}
                        onClickLink={toggleDrawer}
                    />
                </MobileDrawer.Item>
            );
        }

        const has_subroutes = route_config.routes.some(route => route.subroutes);

        const disableRoute = route_path => {
            if (/financial-assessment/.test(route_path)) {
                return is_virtual;
            } else if (/trading-assessment/.test(route_path)) {
                return is_virtual || active_account_landing_company !== 'maltainvest';
            } else if (/proof-of-address/.test(route_path) || /proof-of-identity/.test(route_path)) {
                return !should_allow_authentication;
            } else if (/proof-of-income/.test(route_path)) {
                return !should_allow_poinc_authentication;
            } else if (/proof-of-ownership/.test(route_path)) {
                return is_virtual || !is_proof_of_ownership_enabled;
            }
            return false;
        };
        return (
            <MobileDrawer.SubMenu
                key={idx}
                has_subheader
                submenu_icon={route_config.icon_component}
                submenu_title={route_config.getTitle()}
                submenu_suffix_icon='IcChevronRight'
                onToggle={expandSubMenu}
                route_config_path={route_config.path}
            >
                {!has_subroutes &&
                    route_config.routes.map((route, index) => {
                        if (
                            !route.is_invisible &&
                            (route.path !== routes.cashier_pa || is_payment_agent_visible) &&
                            (route.path !== routes.cashier_pa_transfer || is_payment_agent_transfer_visible) &&
                            (route.path !== routes.cashier_p2p || is_p2p_enabled) &&
                            (route.path !== routes.cashier_onramp || is_onramp_visible) &&
                            (route.path !== routes.cashier_acc_transfer || is_account_transfer_visible)
                        ) {
                            return (
                                <MobileDrawer.Item key={index}>
                                    <MenuLink
                                        link_to={route.path}
                                        icon={route.icon_component}
                                        text={route.getTitle()}
                                        onClickLink={toggleDrawer}
                                    />
                                </MobileDrawer.Item>
                            );
                        }
                        return undefined;
                    })}
                {has_subroutes &&
                    route_config.routes.map((route, index) => {
                        return route.subroutes ? (
                            <MobileDrawer.SubMenuSection
                                key={index}
                                section_icon={route.icon}
                                section_title={route.getTitle()}
                            >
                                {route.subroutes.map((subroute, subindex) => (
                                    <MenuLink
                                        key={subindex}
                                        is_disabled={disableRoute(subroute.path) || subroute.is_disabled}
                                        link_to={subroute.path}
                                        text={subroute.getTitle()}
                                        onClickLink={toggleDrawer}
                                    />
                                ))}
                            </MobileDrawer.SubMenuSection>
                        ) : (
                            <MobileDrawer.Item key={index}>
                                <MenuLink
                                    link_to={route.path}
                                    icon={route.icon_component}
                                    text={route.getTitle()}
                                    onClickLink={toggleDrawer}
                                />
                            </MobileDrawer.Item>
                        );
                    })}
            </MobileDrawer.SubMenu>
        );
    };

    const HelpCentreRoute = has_border_bottom => {
        return (
            <MobileDrawer.Item className={classNames({ 'header__menu-mobile-theme': has_border_bottom })}>
                <MenuLink
                    link_to={getStaticUrl('/help-centre')}
                    icon='IcHelpCentre'
                    text={localize('Help centre')}
                    onClickLink={toggleDrawer}
                />
            </MobileDrawer.Item>
        );
    };

    const { pathname: route } = useLocation();
    const { data } = useRemoteConfig();
    const { cs_chat_livechat, cs_chat_whatsapp } = data;
    const is_trading_hub_category =
        route.startsWith(routes.traders_hub) || route.startsWith(routes.cashier) || route.startsWith(routes.account);
    return (
        <React.Fragment>
            <a id='dt_mobile_drawer_toggle' onClick={toggleDrawer} className='header__mobile-drawer-toggle'>
                <Icon
                    icon={is_appstore && !is_logged_in ? 'IcHamburgerWhite' : 'IcHamburger'}
                    width='16px'
                    height='16px'
                    className='header__mobile-drawer-icon'
                />
            </a>
            <a id='dt_mobile_drawer_toggle' href='https://t.me/binarytools' className='header__mobile-drawer-toggle' target='_blank' rel='noopener noreferrer'>
                <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="20px" viewBox="0 0 256 256">
                    <defs>
                        <linearGradient id="logosTelegram0" x1="50%" x2="50%" y1="0%" y2="100%">
                            <stop offset="0%" stopColor="#2aabee"/>
                            <stop offset="100%" stopColor="#229ed9"/>
                        </linearGradient>
                    </defs>
                    <path fill="url(#logosTelegram0)" d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.038 128.038 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51c0-33.934-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0"/>
                    <path fill="#fff" d="M57.94 126.648c37.32-16.256 62.2-26.974 74.64-32.152c35.56-14.786 42.94-17.354 47.76-17.441c1.06-.017 3.42.245 4.96 1.49c1.28 1.05 1.64 2.47 1.82 3.467c.16.996.38 3.266.2 5.038c-1.92 20.24-10.26 69.356-14.5 92.026c-1.78 9.592-5.32 12.808-8.74 13.122c-7.44.684-13.08-4.912-20.28-9.63c-11.26-7.386-17.62-11.982-28.56-19.188c-12.64-8.328-4.44-12.906 2.76-20.386c1.88-1.958 34.64-31.748 35.26-34.45c.08-.338.16-1.598-.6-2.262c-.74-.666-1.84-.438-2.64-.258c-1.14.256-19.12 12.152-54 35.686c-5.1 3.508-9.72 5.218-13.88 5.128c-4.56-.098-13.36-2.584-19.9-4.708c-8-2.606-14.38-3.984-13.82-8.41c.28-2.304 3.46-4.662 9.52-7.072"/>
                </svg>
            </a>

            {/* Use img tag with src pointing to the  */}
            <a id='dt_mobile_drawer_toggle' href='https://www.youtube.com/@BinarytoolTutorial' className='header__mobile-drawer-toggle'>
            <svg width="30px" height="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="red" d="M14.712 4.633a1.754 1.754 0 00-1.234-1.234C12.382 3.11 8 3.11 8 3.11s-4.382 0-5.478.289c-.6.161-1.072.634-1.234 1.234C1 5.728 1 8 1 8s0 2.283.288 3.367c.162.6.635 1.073 1.234 1.234C3.618 12.89 8 12.89 8 12.89s4.382 0 5.478-.289a1.754 1.754 0 001.234-1.234C15 10.272 15 8 15 8s0-2.272-.288-3.367z"/><path fill="#ffffff" d="M6.593 10.11l3.644-2.098-3.644-2.11v4.208z"/></svg>
            </a>
            <a id='dt_mobile_drawer_toggle' href='#' className='header__mobile-drawer-toggle' onClick={(e) => { e.preventDefault(); window.location.reload(); }}>
            <svg width="100px" height="20px" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0, 0)">
                <path d="M6 7L7 6L4.70711 3.70711L5.29289 3.12132C6.01086 2.40335 6.98464 2 8 2C9.01536 2 9.98914 2.40335 10.7071 3.12132L10.7929 3.20711C11.5658 3.98 12 5.02828 12 6.12132L12 7L14 7V6.12132C14 4.49785 13.3551 2.94086 12.2071 1.79289L12.1213 1.70711C11.0283 0.614064 9.5458 0 8 0C6.45421 0 4.97172 0.614064 3.87868 1.70711L3.29289 2.29289L1 0L0 1V7H6Z" fill="#FF0000"/>
                <path d="M10.7071 12.8787C9.98914 13.5966 9.01536 14 8 14C6.98464 14 6.01086 13.5967 5.29289 12.8787L5.20711 12.7929C4.43421 12.02 4 10.9717 4 9.87868L4 9L2 9V9.87868C2 11.5022 2.64492 13.0591 3.79289 14.2071L3.87868 14.2929C4.97172 15.3859 6.45421 16 8 16C9.54579 16 11.0283 15.3859 12.1213 14.2929L12.7071 13.7071L15 16L16 15L16 9L10 9L9 10L11.2929 12.2929L10.7071 12.8787Z" fill="#FF0000"/>
            </g>
            <text x="20" y="14" fill="#FF0000" font-size="15" font-weight="bold">REFRESH</text>
            </svg>
            </a>
            <MobileDrawer
                alignment={is_appstore ? 'right' : 'left'}
                icon_class='header__menu-toggle'
                is_open={is_open}
                transitionExit={transitionExit}
                toggle={toggleDrawer}
                id='dt_mobile_drawer'
                enableApp={enableApp}
                disableApp={disableApp}
                title={<MenuTitle />}
                height='100vh'
                width='295px'
                className='pre-appstore'
            >
                <Div100vhContainer height_offset='40px'>
                    <div className='header__menu-mobile-body-wrapper'>
                        {is_appstore && (
                            <MobileDrawer.Body>
                                {primary_routes_config.map((route_config, idx) =>
                                    getRoutesWithSubMenu(route_config, idx)
                                )}
                            </MobileDrawer.Body>
                        )}
                        <React.Fragment>
                            {!is_trading_hub_category && (
                                <MobileDrawer.SubHeader
                                    className={classNames({
                                        'dc-mobile-drawer__subheader--hidden': is_submenu_expanded,
                                    })}
                                >
                                    <PlatformSwitcher
                                        app_routing_history={app_routing_history}
                                        is_mobile
                                        is_landing_company_loaded={is_landing_company_loaded}
                                        is_logged_in={is_logged_in}
                                        is_logging_in={is_logging_in}
                                        platform_config={platform_config}
                                        toggleDrawer={toggleDrawer}
                                        current_language={current_language}
                                        setTogglePlatformType={setTogglePlatformType}
                                    />
                                </MobileDrawer.SubHeader>
                            )}
                            <MobileDrawer.Body
                                className={classNames({
                                    'header__menu-mobile-traders-hub': is_trading_hub_category,
                                })}
                            >
                                <div className='header__menu-mobile-platform-switcher' id='mobile_platform_switcher' />
                                <MobileDrawer.Item>
                                    <MenuLink
                                        link_to="https://app.binarytool.site/bot"
                                        icon='IcBinarydbot'
                                        text={localize('Binary DBot')}
                                        onClickLink={toggleDrawer}
                                    />
                                </MobileDrawer.Item>
                                <MobileDrawer.Item>
                                    <MenuLink
                                        link_to="https://block.binarytool.site"
                                        icon='IcBinarybot'
                                        text={localize('Binary Bot')}
                                        onClickLink={toggleDrawer}
                                    />
                                </MobileDrawer.Item>
                                {is_logged_in && (
                                    <MobileDrawer.Item>
                                        <MenuLink
                                            link_to={is_next_wallet_enabled ? routes.wallets : routes.traders_hub}
                                            icon={is_dark_mode ? 'IcAppstoreHomeDark' : 'IcAppstoreTradersHubHome'}
                                            text={localize("Trader's Hub")}
                                            onClickLink={toggleDrawer}
                                        />
                                    </MobileDrawer.Item>
                                )}
                                {!is_trading_hub_category && (
                                    <MobileDrawer.Item>
                                        <MenuLink
                                            link_to={routes.trade}
                                            icon='IcTrade'
                                            text={localize('Trade')}
                                            onClickLink={toggleDrawer}
                                        />
                                    </MobileDrawer.Item>
                                )}
                                {primary_routes_config.map((route_config, idx) =>
                                    getRoutesWithSubMenu(route_config, idx)
                                )}
                                <MobileDrawer.Item
                                    className='header__menu-mobile-theme'
                                    onClick={e => {
                                        e.preventDefault();
                                        toggleTheme(!is_dark_mode);
                                    }}
                                >
                                    <div className={classNames('header__menu-mobile-link')}>
                                        <Icon className='header__menu-mobile-link-icon' icon={'IcTheme'} />
                                        <span className='header__menu-mobile-link-text'>{localize('Dark theme')}</span>
                                        <ToggleSwitch
                                            id='dt_mobile_drawer_theme_toggler'
                                            handleToggle={() => toggleTheme(!is_dark_mode)}
                                            is_enabled={is_dark_mode}
                                        />
                                    </div>
                                </MobileDrawer.Item>

                                {HelpCentreRoute()}
                                {is_logged_in && (
                                    <React.Fragment>
                                        <MobileDrawer.Item>
                                            <MenuLink
                                                link_to={routes.account_limits}
                                                icon='IcAccountLimits'
                                                text={localize('Account Limits')}
                                                onClickLink={toggleDrawer}
                                            />
                                        </MobileDrawer.Item>
                                        <MobileDrawer.Item>
                                            <MenuLink
                                                link_to={getStaticUrl('/responsible')}
                                                icon='IcVerification'
                                                text={localize('Responsible trading')}
                                                onClickLink={toggleDrawer}
                                            />
                                        </MobileDrawer.Item>
                                        {is_eu && show_eu_related_content && !is_virtual && (
                                            <MobileDrawer.Item>
                                                <MenuLink
                                                    link_to={getStaticUrl('/regulatory')}
                                                    icon='IcRegulatoryInformation'
                                                    text={localize('Regulatory information')}
                                                    onClickLink={toggleDrawer}
                                                />
                                            </MobileDrawer.Item>
                                        )}
                                        <MobileDrawer.Item className='header__menu-mobile-theme--trader-hub'>
                                            <MenuLink
                                                link_to={getStaticUrl('/')}
                                                icon='IcDerivOutline'
                                                text={localize('Go to Deriv.com')}
                                                onClickLink={toggleDrawer}
                                            />
                                        </MobileDrawer.Item>
                                    </React.Fragment>
                                )}
                                {liveChat.isReady && cs_chat_whatsapp && (
                                    <MobileDrawer.Item className='header__menu-mobile-whatsapp'>
                                        <Icon icon='IcWhatsApp' className='drawer-icon' />
                                        <a
                                            className='header__menu-mobile-whatsapp-link'
                                            href={whatsapp_url}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            onClick={toggleDrawer}
                                        >
                                            {localize('WhatsApp')}
                                        </a>
                                    </MobileDrawer.Item>
                                )}
                                {cs_chat_livechat && (
                                    <MobileDrawer.Item className='header__menu-mobile-livechat'>
                                        <LiveChat />
                                    </MobileDrawer.Item>
                                )}
                                {is_logged_in && (
                                    <MobileDrawer.Item
                                        onClick={() => {
                                            toggleDrawer();
                                            history.push(routes.index);
                                            logoutClient().then(() => {
                                                window.location.href = 'https://app.binarytool.site';
                                            });
                                        }}
                                        className='dc-mobile-drawer__item'
                                    >
                                        <MenuLink icon='IcLogout' text={localize('Log out')} />
                                    </MobileDrawer.Item>
                                )}
                            </MobileDrawer.Body>
                            <MobileDrawer.Footer className={is_logged_in ? 'dc-mobile-drawer__footer--servertime' : ''}>
                                <ServerTime is_mobile />
                                <NetworkStatus is_mobile />
                            </MobileDrawer.Footer>
                            {is_mobile_language_menu_open && (
                                <MobileLanguageMenu expandSubMenu={expandSubMenu} toggleDrawer={toggleDrawer} />
                            )}
                        </React.Fragment>
                    </div>
                </Div100vhContainer>
            </MobileDrawer>
        </React.Fragment>
    );
});

ToggleMenuDrawer.displayName = 'ToggleMenuDrawer';

export default ToggleMenuDrawer;
