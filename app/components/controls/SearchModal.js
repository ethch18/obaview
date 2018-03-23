import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner';
import axios from 'axios';
import { ENDPOINTS } from '../../util/Constants';
import SearchDirection from './SearchDirection';

const propTypes = {
    input: PropTypes.string.isRequired,
    updater: PropTypes.func.isRequired,
    closer: PropTypes.func.isRequired,
    stopCache: PropTypes.object.isRequired,
};

export default class SearchModal extends React.Component {
    constructor(props) {
        super(props);
        // TODO: fancy logic for converting route no. to route id
        this.state = {
            routeId: this.props.input,
        };
    }

    componentDidMount() {
        axios.get(`${ENDPOINTS['BASE_URL']}${ENDPOINTS['STOPS_FOR_ROUTE']}${this.state.routeId}`)
            .then((response) => {
                // console.log(response);
                if (response.data.code != 200 || !response.data.data) {
                    this.setState({ error: response.data.text });
                }
                else {
                    this.setState({ 
                        data: response.data.data.entry.stopGroupings[0].stopGroups, 
                        refData: response.data.data.references.stops,
                    });
                }
            })
            .catch((error) => {
                // console.log(error);
                this.setState({ error});
            });
    }

    render() {
        let content;
        if (this.state.error) {
            content = (
                <div>
                    <div>An error occurred</div>
                    <div>{this.state.error}</div>
                </div>
            );
        }
        else if (this.state.data && this.state.refData) {
            const directions = [];
            for (let i = 0; i < this.state.data.length; i++) {
                const heading = this.state.data[i].name.name;
                const stops = this.state.data[i].stopIds;
                directions.push(
                    <SearchDirection
                        heading={heading}
                        stops={stops}
                        stopCache={this.props.stopCache} 
                        refData={this.state.refData} 
                        updater={this.props.updater}
                        key={`${heading}-${i}`}
                    />
                );
            }
            content = (
                <div>
                    {directions}
                </div>
            );
        }
        else {
            content = <Spinner />;
        }

        return (
            <div>
                <Modal isOpen className={"show"} toggle={this.props.closer}>
                        <ModalHeader toggle={this.props.closer}>
                            {`Search Results for \"${this.props.input}\"`}
                        </ModalHeader>
                        <ModalBody>
                            {content}
                        </ModalBody>
                </Modal>
            </div>
        );
    }
}

SearchModal.propTypes = propTypes;
