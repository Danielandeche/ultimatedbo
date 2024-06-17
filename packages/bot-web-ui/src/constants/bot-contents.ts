type TTabsTitle = {
    [key: string]: string | number;
};

type TDashboardTabIndex = {
    [key: string]: number;
};

export const tabs_title: TTabsTitle = Object.freeze({
    WORKSPACE: 'Workspace',
    CHART: 'Chart',
});

export const DBOT_TABS: TDashboardTabIndex = Object.freeze({
    DASHBOARD: 0,
    BOT_BUILDER: 1,
    BINARYTOOLS_BOTS: 2,
    COPYTRADING: 3,
    ANALYSISTOOL: 4,
    TRADING_VIEW: 6,
    CHART: 7,
    TUTORIAL: 8,
});

export const MAX_STRATEGIES = 10;

export const TAB_IDS = ['id-dbot-dashboard', 'id-bot-builder', 'id-copytrading', 'id-analysistool', 'id-trading-view', 'id-charts', 'id-tutorials'];

export const DEBOUNCE_INTERVAL_TIME = 500;
