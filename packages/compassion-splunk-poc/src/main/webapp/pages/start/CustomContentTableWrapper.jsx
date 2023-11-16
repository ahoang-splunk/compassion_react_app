import React, { useState, useEffect } from 'react';
import { cloneDeep } from 'lodash';
import { _ } from '@splunk/ui-utils/i18n';
import Paginator from '@splunk/react-ui/Paginator';
import CustomContentTable from './CustomContentTable';

// Extract data from the datasource a format usable by the table
const formatDatas = (dataSources) => {
    if (dataSources === undefined || dataSources.length == 0) {
        return dataSources;
    }
    // Get the names of the fields

    const data = cloneDeep(dataSources);
    // console.log(data)

    return data;
};

const CustomContentTableWrapper = ({
    dataSources,
    dataFields,
    toggleRows,
    expansion
}) => {
    const [tableData, setTableData] = useState(formatDatas(dataSources));
    const [tableHeader, setTableHeader] = useState(formatDatas(dataFields));


    useEffect(() => {
        setTableData(formatDatas(dataSources));
    }, [dataSources]);

    useEffect(() => {
        setTableHeader(formatDatas(dataFields));
    }, [dataFields]);



    return (
        <div>
            <CustomContentTable
                dataSources={tableData}
                dataFields={dataFields}
                toggleRows={toggleRows}
                expansion={expansion}
            />
        </div>
    );
};

export default CustomContentTableWrapper;