import React, { useState, useEffect, useCallback,useRef } from 'react';
import Table from '@splunk/react-ui/Table';
import Switch from '@splunk/react-ui/Switch';
import DL from '@splunk/react-ui/DefinitionList';
import { cloneDeep, find } from 'lodash';
import Cog from '@splunk/react-icons/Cog';
import Button from '@splunk/react-ui/Button';
import Menu from '@splunk/react-ui/Menu';
import Modal from '@splunk/react-ui/Modal';
import List from '@splunk/react-ui/List';
import Dropdown from '@splunk/react-ui/Dropdown';
import CreatePanelModal from './CreatePanelModal';


const formatData = (dataSources, dataFields) => {
    if ((dataSources === undefined || dataSources.length == 0) || (dataFields === undefined || dataFields.length == 0)) {
        return {
            fields: [],
            data: [],
        };
    }

    // Get the names of the fields

    const fields = [];

    dataFields.forEach((element) => {
        fields.push(element.name)
    });

    const data = cloneDeep(dataSources);


    return { fields, data };
};

const CustomContentTable = ({
    dataSources,
    dataFields,
    toggleRows,
    expansion=false
    }) => {
        console.log("here")
        const [tableData, setTableData] = useState(formatData((dataSources, dataFields)));
        const [sortKey, setSortKey] = useState(dataFields[0].name);
        const [sortDir, setSortDir] = useState('asc');
        const headersToHide = ["_key"];
        const [selectedRow, setSelectedRow] = useState(false);
        const [expandedRowId, setExpandedRowId] = useState(null);
        const [open, setOpen] = useState(false);
        const modalToggle = useRef(null);

        useEffect(() => {
            setTableData(formatData(dataSources, dataFields));
        }, [dataSources, dataFields]);

        function getExpansionRow(row) {
            // let externalLink = row["External Link"]
            // if (externalLink && !(externalLink.includes("http://") || externalLink.includes("https://")))
            //     externalLink = "http://" + externalLink
            return (
                <Table.Row key={`${row.Account_ID}-expansion`}>
                    <Table.Cell style={{ borderTop: 'none' }} colSpan={8}>
                        <DL>
                            <DL.Term>Account ID</DL.Term>
                            <DL.Description>{row.AccountId}</DL.Description>
                            <DL.Term>Found Date</DL.Term>
                            <DL.Description>{row.FoundDate}</DL.Description>
                        </DL>
                    </Table.Cell>
                </Table.Row>
            );
        }
        console.log("here2")
        console.log(tableData.fields)

        const handleSort = (e, { sortKey }) => {
            const prevSortKey = sortKey;
            const prevSortDir = prevSortKey === sortKey ? sortDir : 'none';
            const nextSortDir = prevSortDir === 'asc' ? 'desc' : 'asc';
            setSortDir(nextSortDir);
            setSortKey(sortKey);
        };
        
        const handleToggle = (event, { AccountId }) => {
            const data = cloneDeep(tableData.data);
            const selectedRow = find(data, { AccountId });


            if (selectedRow) {
                selectedRow.selected = !selectedRow.selected;

                setTableData({
                    fields: tableData.fields,
                    data,
                });
            }
        };

        const handleToggleAll = () => {

            const data = cloneDeep(tableData.data);
            const selected = rowSelectionState(data) !== 'all';
    
            setTableData({
                fields: tableData.fields,
                data: data.map((row) => ({
                    ...row,
                    selected: row.disabled ? false : selected,
                })),
            });
    
        };


        const rowSelectionState = (data) => {
            if (data.length == 0) return 'none';
    
            const selectedCount = data.reduce(
                (count, { selected }) => (selected ? count + 1 : count),
                0
            );
    
            const disabledCount = data.reduce(
                (count, { disabled }) => (disabled ? count + 1 : count),
                0
            );
            if (selectedCount === 0) {
                return 'none';
            }
            if (selectedCount + disabledCount === data.length) {
                return 'all';
            }
            return 'some';
        };
        const handleRowExpansion = (rowId) => {
            if (expandedRowId === rowId) {
                setExpandedRowId(null);
            } else {
                setExpandedRowId(rowId);
            }
        };
        const handleRequestOpen = () => {
            setOpen(true);
        };
        const handleRequestClose = () => {
            setOpen(false);
            modalToggle?.current?.focus(); // Must return focus to the invoking element when the modal closes
        };
        const toggle = (
            <Button
                appearance="secondary"
                data-test="actions-toggle"
                icon={<Cog hideDefaultTooltip />}
            />
        );

        const custom_actions = () => {
            const data = cloneDeep(tableData.data)
            return [
                <>
                {<Dropdown toggle={toggle} key="settings">
                    <Menu>
                        <Menu.Item onClick={handleRequestOpen} elementRef={modalToggle} ref={modalToggle}>
                        </Menu.Item>
                    </Menu>
                </Dropdown>}
                <Modal open={open} style={{ width: '600px' }}>
                <Modal.Body>
                    <List>
                        {data.map((element) => <List.Item>{`${element["AccountId"]}`}</List.Item>)}
                    </List>
                </Modal.Body>
                <Modal.Footer>
                <Button appearance="secondary" onClick={handleRequestClose} label="Submit" />
                </Modal.Footer>
                </Modal>
                </>
            ]
        }

        function rowActionPrimaryButton(row) {
            return <CreatePanelModal action={"Edit"} row={row}/>
        }

        return (
            <div>
                <Table
                    onRequestToggleAllRows={toggleRows ? handleToggleAll : null}
                    rowSelection={toggleRows ? rowSelectionState(cloneDeep(tableData.data)) : null}
                    stripeRows
                    rowExpansion={expansion ? "controlled" : undefined}
                    actions={custom_actions()}
                >
                    <Table.Head>
                        {tableData.fields.map((headData) => 
                            (
                                <Table.HeadCell
                                    key={headData}
                                    onSort={handleSort}
                                    sortKey={headData}
                                    sortDir={headData === sortKey ? sortDir : 'none'}
                                >
                                    {headData}
                                </Table.HeadCell>
                        ))}
                    </Table.Head>
                    <Table.Body>
                        {tableData.data
                        .sort((rowA, rowB) => {
                            if (sortDir === 'asc') {
                                return rowA[sortKey] > rowB[sortKey] ? 1 : -1;
                            }
                            if (sortDir === 'desc') {
                                return rowB[sortKey] > rowA[sortKey] ? 1 : -1;
                            }
                            return 0;
                        })
                        .map((row) => (
                            <Table.Row
                                actionPrimary={rowActionPrimaryButton(row)}
                                key={row.AccountId}
                                data={row}
                                onRequestToggle={toggleRows ? handleToggle : null}
                                selected={row.selected}
                                expansionRow={expansion ? getExpansionRow(row): null}
                                onExpansion={expansion ? () => handleRowExpansion(row.AccountId): null}
                                expanded={expansion ? row.AccountId === expandedRowId: null}
                            >
                                {tableData.fields.map(
                                    (header) => {
                                        return (
                                            <Table.Cell>
                                                {row[header]}
                                            </Table.Cell>    
                                        )

                                    }
                                )}

                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        )

    }

export default CustomContentTable;