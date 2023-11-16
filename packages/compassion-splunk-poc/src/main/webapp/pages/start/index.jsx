import React, { useState, useEffect } from 'react';

import layout from '@splunk/react-page';
import CustomContentTable from '@splunk/custom-content-table';
import CustomContentTableWrapper from './CustomContentTableWrapper';
import { getUserTheme } from '@splunk/splunk-utils/themes';
import SearchJob from '@splunk/search-job';
import Button from '@splunk/react-ui/Button';
import Cog from '@splunk/react-icons/Cog';
import SplunkThemeProvider from '@splunk/themes/SplunkThemeProvider';
import Card from '@splunk/react-ui/Card';
import { StyledContainer, StyledGreeting } from './StartStyles';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import Select from '@splunk/react-ui/Select';
import Search from '@splunk/react-ui/Search';
import Heading from '@splunk/react-ui/Heading';

function MyDashboard(){
    const [dataSources, setDataSources] = useState([]);
    const [dataFields, setDataFields] = useState([]);
    const selectedAccountId = ["1234566", "1234567"]

    function ReactTable(){
        SearchJob.create({
            search: '| inputlookup open_cases.csv | table "AccountId", "FoundDate", "MatchType", Supporter',
            earliest_time: '-60m@m',
            latest_time: 'now',
        }, {
            app: 'compassion-splunk-poc',
            owner: 'admin',
        })
            .getResults({ count: 0 })
            .subscribe((results) => {
                console.log("hi")
                console.log(results)
                setDataFields(results.fields)
                setDataSources(results.results)
            });
    }

    const toggle = (
        <Button
            appearance="secondary"
            data-test="actions-toggle"
            icon={<Cog hideDefaultTooltip />}
        />
    );
    useEffect(() =>{
        
        ReactTable();
    }, [])


    return(
  
        <StyledContainer>
            <Heading level={1} style={{ marginTop: 0 }}>Open Cases</Heading>
            <Card style={{ width: "100%", marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginLEt: 30}}>
                <ControlGroup label="Select AccountId" labelPosition="top">
                        <Select
                            placeholder={_(`Select an AccountId`)}
                            filter
                            animateLoading
                        >
                            {selectedAccountId.map((value) => (
                                <Select.Option
                                    label={value}
                                    value={value}
                                />
                            ))}
                        </Select>
                        <Search
                            placeholder={_(`Search`)}
                            style={{width: 200}}
                            animateLoading
                        >
                        </Search>
                </ControlGroup>
                </div>
                {/* <div style={{ marginBottom: 20, marginLeft: 20 }}>
                    <div style={{ marginBottom: 20, marginLeft: 10, float: "left" }}>
                    <Search
                        placeholder={_(`Search`)}
                        style={{width: 200}}
                        animateLoading
                    >
                    </Search>
                    </div>
                </div> */}
                <Card.Body style={{ width: "100%", justifyContent: 'center', alignItems: 'center' }}>
                    {((dataSources != undefined && dataFields != undefined) && (dataSources.length>0 && dataFields.length>0)) && <CustomContentTableWrapper
                        dataSources={dataSources}
                        dataFields={dataFields}
                        onChange={ReactTable}
                        toggleRows={true}
                        expansion={true}
                    />

                    }
                </Card.Body>
            </Card>

        </StyledContainer>

    );

}

layout(
    <SplunkThemeProvider family="enterprise" density="comfortable">
        <MyDashboard/>
    </SplunkThemeProvider>
)
