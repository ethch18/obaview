import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner';
import axios from 'axios';
import { ENDPOINTS, GENERAL_ERROR, RESPONSE_OK } from '../../util/Constants';
import SearchRoute from './SearchRoute';

const propTypes = {
    input: PropTypes.string.isRequired,
    updater: PropTypes.func.isRequired,
    closer: PropTypes.func.isRequired,
    agencyCache: PropTypes.object.isRequired,
    routeCache: PropTypes.object.isRequired,
    stopCache: PropTypes.object.isRequired
};

export default class SearchModal extends React.Component {
    constructor(props) {
        super(props);
        // TODO: fancy logic for converting route no. to route id
        this.state = {
            searchQuery: this.props.input
        };
    }

    componentDidMount() {
        axios
            .get(
                `${ENDPOINTS['BASE_URL']}${ENDPOINTS['SEARCH']}${
                    this.state.searchQuery
                }`
            )
            .then(response => {
                // console.log(response);
                if (!response.data.data || response.data.data.length == 0) {
                    // this.setState({ error: response.data.text });
                    this.setState({ error: GENERAL_ERROR });
                } else {
                    const stopDatas = [];
                    const stopRefDatas = [];
                    const routes = [];
                    const routeRefDatas = [];
                    const agencyRefDatas = [];

                    for (let i = 0; i < response.data.data.length; i++) {
                        const currResponse = response.data.data[i];
                        if (currResponse.code === RESPONSE_OK) {
                            stopDatas.push(
                                currResponse.data.entry.stopGroupings[0]
                                    .stopGroups
                            );
                            stopRefDatas.push(
                                currResponse.data.references.stops
                            );
                            routes.push(currResponse.data.entry.routeId);
                            routeRefDatas.push(
                                currResponse.data.references.routes
                            );
                            agencyRefDatas.push(
                                currResponse.data.references.agencies
                            );
                        }
                    }

                    if (response.data.data.length !== routes.length) {
                        this.setState({ error: GENERAL_ERROR });
                    } else {
                        this.setState({
                            content: {
                                stopDatas,
                                stopRefDatas,
                                routes,
                                routeRefDatas,
                                agencyRefDatas
                            }
                        });
                    }
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
        } else if (this.state.content) {
            const {
                agencyRefDatas,
                routes,
                routeRefDatas,
                stopDatas,
                stopRefDatas
            } = this.state.content;
            const returnedRoutes = [];
            for (let i = 0; i < routes.length; i++) {
                const agencyRefData = agencyRefDatas[i];
                const route = routes[i];
                const routeRefData = routeRefDatas[i];
                const stopData = stopDatas[i];
                const stopRefData = stopRefDatas[i];
                returnedRoutes.push(
                    <SearchRoute
                        agencyCache={this.props.agencyCache}
                        agencyRefData={agencyRefData}
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
