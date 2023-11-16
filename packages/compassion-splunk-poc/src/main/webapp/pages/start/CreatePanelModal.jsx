import React, { useState, useEffect, useCallback, useRef } from 'react';
import Modal from '@splunk/react-ui/Modal';
import Pencil from '@splunk/react-icons/Pencil';
import Button from '@splunk/react-ui/Button';
import Tooltip from '@splunk/react-ui/Tooltip';
import File from '@splunk/react-ui/File';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import TextArea from '@splunk/react-ui/TextArea';
import Select from '@splunk/react-ui/Select';
import Multiselect from '@splunk/react-ui/Multiselect';
import Text from '@splunk/react-ui/Text';

const CreatePanelModal = ({ action, row}) => {
    const modalToggle = useRef(null);
    const [open, setOpen] = useState(false);
    const [filename,setFilename] = useState('')
    const fileReader = new FileReader();

    const handleRequestOpen = () => {
        setOpen(true);
    };

    const handleRequestClose = () => {
        setOpen(false);
        modalToggle?.current?.focus();
    };

    const handleAddFiles = (files) => {
        if (files.length > 0) {
            const file = files[0];

            if (fileReader.readyState === 1) {
                fileReader.abort();
            }

            fileReader.onload = () => {
                // can access this.fileReader.result
                setFilename(file.name);
            };

            fileReader.readAsText(file);
        }
    };

    const handleRemoveFile = () => {
        if (fileReader.readyState === 1) {
            fileReader.abort();
        }

        setFilename(undefined);
    };
    return (
        <div style={{ float: 'right', marginLeft: 10, marginRight: 20 }}>
            { action =="Edit" && 
            <Tooltip
            content={_('Edit')}
            contentRelationship="label"
            style={{ marginRight: 8 }}
            >
            <Button onClick={handleRequestOpen} appearance="secondary" ref={modalToggle} label="" icon={<Pencil hideDefaultTooltip screenReaderText={null}/>}/>
            </Tooltip>
            }
            <Modal onRequestClose={handleRequestClose} open={open} style={{ width: '700px' }}>
                <Modal.Header
                    onRequestClose={handleRequestClose}
                    title={`${action} a Match`}
                    icon={<Pencil width="100%" height="100%" />}
                />
                <Modal.Body>
                    <ControlGroup label="Upload SXO Registration Screenshot">
                        <File onRequestAdd={handleAddFiles} onRequestRemove={handleRemoveFile}>
                            {filename && <File.Item name={filename} />}
                        </File>
                    </ControlGroup>
                    <ControlGroup label="Upload Additional files">
                        <File onRequestAdd={handleAddFiles} onRequestRemove={handleRemoveFile}>
                            {filename && <File.Item name={filename} />}
                        </File>
                    </ControlGroup>
                    <ControlGroup label="Add a note">
                        <TextArea />
                    </ControlGroup>
                    <ControlGroup
                        label="Add an address"
                        controlsLayout="fillJoin"
                        tooltip="More information..."
                    >
                        <Text />
                    </ControlGroup>
                    <ControlGroup label="Outcome of Investigation">
                        <Multiselect defaultValue={['sxo']}>
                            <Multiselect.Option label="Is SXO" value="sxo" />
                            <Multiselect.Option label="Lives with SXO" value="lives" />
                            <Multiselect.Option label="Clear" value="clear" />
                            <Multiselect.Option label="Fraud" value="fraud" />
                            <Multiselect.Option label="Previosly scored" value="previous" />
                        </Multiselect>
                    </ControlGroup>
                    <ControlGroup label="No outcome yet?">
                        <Select defaultValue="six">
                            <Select.Option label="Remind me in 6 months" value="six" />
                            <Select.Option label="Remind me in 12 months" value="twelve" />
                        </Select>
                    </ControlGroup>
                </Modal.Body>
            </Modal>
        </div>
        
    )
};

export default CreatePanelModal;