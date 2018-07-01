import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner';
import axios from 'axios';
import {
    ENDPOINTS,
    GENERAL_ERROR,
    INVALID_ROUTE_ERROR
} from '../../util/Constants';
import SearchRoute from './SearchRoute';

const propTypes = {
    input: PropTypes.string.isRequired,
    updater: PropTypes.func.isRequired,
    closer: PropTypes.func.isRequired,
    routeCache: PropTypes.object.isRequired,
    stopCache: PropTypes.object.isRequired
};

export default class SearchModal extends React.Component {
    constructor(props) {
        super(props);
        // TODO: fancy logic for converting route no. to route id
        this.state = {
            searchQuery: this.props.input,
            routes: [],
            routeRefDatas: [],
            stopDatas: [],
            stopRefDatas: []
        };
    }

    componentDidMount() {
        axios
            .get(
                `${ENDPOINTS['BASE_URL']}${ENDPOINTS['STOPS_FOR_ROUTE']}${
                    this.state.searchQuery
                }`
            )
            .then(response => {
                // console.log(response);
                if (response.data.code != 200 || !response.data.data) {
                    // this.setState({ error: response.data.text });
                    this.setState({ error: INVALID_ROUTE_ERROR });
                } else {
                    this.setState({
                        stopDatas: this.state.stopDatas.concat([
                            response.data.data.entry.stopGroupings[0].stopGroups
                        ]),
                        stopRefDatas: this.state.stopRefDatas.concat([
                            response.data.data.references.stops
                        ]),
                        routes: this.state.routes.concat([
                            response.data.data.entry.routeId
                        ]),
                        routeRefDatas: this.state.routeRefDatas.concat([
                            response.data.data.references.routes
                        ])
                    });
                }
            })
            .catch(error => {
                // console.log(error);
                // this.setState({ error });
                this.setState({ error: GENERAL_ERROR });
            });
    }

    render() {
        let content;
        if (this.state.error) {
            content = (
                <div>
                    <div> An error occurred!</div>
                    <div className="searchmodal-errorcontent">
                        {this.state.error}
                    </div>
                </div>
            );
        } else if (
            this.state.stopDatas &&
            this.state.stopRefDatas &&
            this.state.routes &&
            this.state.routeRefDatas
        ) {
            const returnedRoutes = [];
            for (let i = 0; i < this.state.routes.length; i++) {
                const route = this.state.routes[i];
                const routeRefData = this.state.routeRefDatas[i];
                const stopData = this.state.stopDatas[i];
                const stopRefData = this.state.stopRefDatas[i];
                returnedRoutes.push(
                    <SearchRoute
                        routeCache={this.props.routeCache}
                        route={route}
                        routeRefData={routeRefData}
                        stopRefData={stopRefData}
                        stopData={stopData}
                        stopCache={this.props.stopCache}
                        updater={this.props.updater}
                        key={`returnedRoutes-${route}`}
                    />
                );
            }
            content = returnedRoutes;
        } else {
            content = <Spinner />;
        }

        return (
            <div>
                <Modal isOpen className={'show'} toggle={this.props.closer}>
                    <ModalHeader toggle={this.props.closer}>
                        {`Search Results for \"${this.props.input}\"`}
                    </ModalHeader>
                    <ModalBody>{content}</ModalBody>
                </Modal>
            </div>
        );
    }
}

SearchModal.propTypes = propTypes;
