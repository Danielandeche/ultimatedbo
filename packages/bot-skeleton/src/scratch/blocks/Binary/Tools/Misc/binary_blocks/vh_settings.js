import { localize } from '@deriv/translations';

Blockly.Blocks.vh_settings = {
    protected_statements: ['STATEMENT'],
    required_child_blocks: ['martingale', 'virtual_token', 'max_steps', 'min_trades', 'take_profit', 'stop_loss'],
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('set {{ variable }} to Virtual Hook Settings {{ dummy }}', {
                variable: '%1',
                dummy: '%2',
            }),
            message1: '%1',
            args0: [
                {
                    type: 'field_variable',
                    name: 'VARIABLE',
                    variable: 'Ultimate Traders virtual hook',
                },
                {
                    type: 'input_dummy',
                },
            ],
            args1: [
                {
                    type: 'input_statement',
                    name: 'STATEMENT',
                    check: null,
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Calculates Simple Moving Average (SMA) from a list with a period'),
            previousStatement: null,
            nextStatement: null,
            category: Blockly.Categories.Indicators,
        };
    },
    meta() {
        return {
            display_name: localize('Virtual Hook'),
            description: localize(
                'Virtual Hook is an innovative trading tool designed to enhance the trading experience by allowing users to engage in virtual trades alongside live trading activities. This unique feature aims to minimize potential losses by offering the option to take partial virtual trades instead of committing fully to live trades.'
            ),
        };
    },
};

Blockly.JavaScript.vh_settings = block => {
    // const input = block.childValueToCode('input_list', 'INPUT_LIST');
    const martingale = block.childValueToCode('martingale', 'MARTINGALE');
    const max_steps = block.childValueToCode('max_steps', 'MAX_STEPS');
    const min_trades = block.childValueToCode('min_trades', 'MIN_TRADES');
    const take_profit = block.childValueToCode('take_profit', 'TAKE_PROFIT');
    const stop_loss = block.childValueToCode('stop_loss', 'STOP_LOSS');
    const code = `Bot.activateVHVariables(${martingale}, ${max_steps}, ${min_trades}, ${take_profit}, ${stop_loss});\n`;
    return code;
};
