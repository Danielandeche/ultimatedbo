import { STRATEGIES } from "src/pages/bot-builder/quick-strategy/config";

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
    ANALYSISPAGE: 1,
    DASHBOARD: 0,
    BOT_BUILDER: 2,
    BINARYTOOLS_BOTS: 3,
    COPYTRADING: 4,
    ANALYSISTOOL: 5,
    TRADING_VIEW: 7,
    CHART: 8,
    TUTORIAL: 9,
});

export const MAX_STRATEGIES = 10;

export const TAB_IDS = ['id-dbot-dashboard', 'id-bot-builder', 'id-copytrading', 'id-analysistool', 'id-trading-view', 'id-charts', 'id-tutorials'];

export const DEBOUNCE_INTERVAL_TIME = 500;
