import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired
};

export default function HelpModal(props) {
    const { isOpen, toggle } = props;

    return (
        <div>
            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>Help! I'm stuck!</ModalHeader>
                <ModalBody>
                    <div>To get started, follow the steps below:</div>
                    <ol>
                        <li>
                            Search for your route ID or number in the search
                            box. Click the{' '}
                            <span className="fa icon fa-search" /> button or
                            press the "enter" key to search.
                        </li>
                        <li>
                            Select the direction, then the stop that you want to
                            track.
                        </li>
                        <li>
                            {
                                "That's it!  The stop will show up on your dashboard, and you can refresh it by clicking the "
                            }
                            <span className="fa icon fa-refresh" />
                            {' icon, or delete it by clicking the '}
                            <span className="fa icon fa-trash" />
                            {' icon.'}
                        </li>
                        <li>
                            You can reorder your stops by dragging them around.
                        </li>
                    </ol>
                    <div>Thanks for using where's my bus!</div>
                </ModalBody>
            </Modal>
        </div>
    );
}

HelpModal.propTypes = propTypes;
