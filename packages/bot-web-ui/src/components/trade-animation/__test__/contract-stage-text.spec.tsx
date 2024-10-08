import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
import { contract_stages } from 'Constants/contract-stage';
import ContractStageText from '../contract-stage-text';

const stageTextMapping = Object.freeze({
    NOT_RUNNING: 'Software is not running',
    STARTING: 'Software is starting',
    PURCHASE_SENT: 'Buying contract',
    PURCHASE_RECEIVED: 'Contract bought',
    IS_STOPPING: 'Software is stopping',
    CONTRACT_CLOSED: 'Contract closed',
});

describe('ContractStageText', () => {
    const stages = Object.keys(contract_stages);
    stages.forEach(stage => {
        it(`should render <ContractStageText /> correct text for ${stage} stage`, () => {
            render(<ContractStageText contract_stage={contract_stages[stage as keyof typeof contract_stages]} />);
            expect(screen.getByText(stageTextMapping[stage as keyof typeof contract_stages])).toBeInTheDocument();
        });
    });
});
