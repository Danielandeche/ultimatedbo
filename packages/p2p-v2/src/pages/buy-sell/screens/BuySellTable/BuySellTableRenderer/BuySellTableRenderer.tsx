import React, { memo } from 'react';
import { Table } from '@/components';
import { DerivLightIcCashierNoAdsIcon } from '@deriv/quill-icons';
import { ActionScreen, Loader, Text } from '@deriv-com/ui';
import { BuySellTableRow } from '../../BuySellTableRow';
import { TBuySellTableRowRenderer } from '../BuySellTable';

const BuySellRowRenderer = memo((values: TBuySellTableRowRenderer) => <BuySellTableRow {...values} />);
BuySellRowRenderer.displayName = 'BuySellRowRenderer';

const columns = [
    { header: 'Advertisers' },
    { header: 'Limits' },
    { header: 'Rate (1 USD)' },
    { header: 'Payment methods' },
];

const headerRenderer = (header: string) => <span>{header}</span>;

type TBuySellTableRowRendererProps = {
    data?: TBuySellTableRowRenderer[];
    isFetching: boolean;
    isLoading: boolean;
    loadMoreAdverts: () => void;
    searchValue: string;
};

const BuySellTableRenderer = ({
    data,
    isFetching,
    isLoading,
    loadMoreAdverts,
    searchValue,
}: TBuySellTableRowRendererProps) => {
    if (isLoading) {
        return <Loader className='mt-80' />;
    }

    if (!data && !searchValue) {
        return (
            <div className='mt-[5.5rem] lg:mt-10'>
                <ActionScreen
                    icon={<DerivLightIcCashierNoAdsIcon height='128px' width='128px' />}
                    title={<Text weight='bold'>No ads for this currency at the moment 😞</Text>}
                />
            </div>
        );
    }

    return (
        <Table
            columns={columns}
            data={data}
            emptyDataMessage='There are no matching ads.'
            isFetching={isFetching}
            loadMoreFunction={loadMoreAdverts}
            renderHeader={headerRenderer}
            rowRender={(data: unknown) => <BuySellRowRenderer {...(data as TBuySellTableRowRenderer)} />}
            tableClassname=''
        />
    );
};

export default memo(BuySellTableRenderer);
