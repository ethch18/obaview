import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
}

export default function HelpModal(props) {
    const { isOpen, toggle } = props;

    return (
        <div>
            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>Help!  I'm stuck!</ModalHeader>
                <ModalBody>
                    <div>To get started, follow the steps below:</div>
                    <ol>
                        <li>
                            {"We currently can't look up route numbers directly.  Please check "}
                            <a href="./mappings.txt">here</a>
                            {" for a list of route ID's for any routes you might be looking for."}
                            </li>
                        <li>Search for your route ID in the search box.  Click the <span className="fa icon fa-search" /> button or press enter to search.</li>
                        <li>Select the direction, then the stop that you want to watch.</li>
                        <li>
                            {"That's it!  The stop will show up on your dashboard, and you can refresh it by clicking the "}
                            <span className="fa icon fa-refresh" />
                            {" icon, or delete it by clicking the "}
                            <span className="fa icon fa-trash" />
                            {" icon."}
                        </li>
                    </ol>
                    <div>Thanks for using where's my bus!</div>
                </ModalBody>
            </Modal>
        </div>
    );
}

HelpModal.propTypes = propTypes;
