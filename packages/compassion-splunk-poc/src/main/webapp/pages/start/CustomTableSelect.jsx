import React, { useState, useEffect } from 'react';
import { cloneDeep } from 'lodash';
import { _ } from '@splunk/ui-utils/i18n';
import Search from '@splunk/react-ui/Search';


const CustomTableSelect = ({ dataSources }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState([]);

    return (
        <Search
            placeholder={_(`Search`)}
            style={{width: 200}}
            animateLoading
        >

        </Search>
    )
}