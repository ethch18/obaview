import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, ListGroup, ListGroupItem } from 'reactstrap';

const propTypes = {
    heading: PropTypes.string.isRequired,
    stops: PropTypes.arrayOf(PropTypes.string).isRequired,
    stopCache: PropTypes.object.isRequired,
    refData: PropTypes.arrayOf(PropTypes.object).isRequired,
    updater: PropTypes.func.isRequired
};

export default class SearchDirection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
        this.toggleShow = this.toggleShow.bind(this);
    }

    toggleShow() {
        this.setState({ show: !this.state.show });
    }

    render() {
        const stopItems = [];
        const stops = this.props.stops;
        for (let i = 0; i < stops.length; i++) {
            const currId = stops[i];
            // console.log(currId);
            let stopName;
            if (this.props.stopCache[currId]) {
                stopName = this.props.stopCache[currId];
            } else {
                for (let stopEntry of this.props.refData) {
                    this.props.stopCache[stopEntry.id] = `${stopEntry.name} (${
                        stopEntry.direction
                    })`;
                    if (stopEntry.id === currId) {
                        stopName = this.props.stopCache[currId];
                        break;
                    }
                }
            }
            stopItems.push(
                <ListGroupItem
                    key={`${this.props.heading}-${i}`}
                    onClick={() => this.props.updater(currId)}
                    className="clickable searchmodal-content"
                >
                    {stopName}
                </ListGroupItem>
            );
        }
        return (
            <div>
                <div
                    onClick={this.toggleShow}
                    className="searchmodal-content clickable"
                >
                    {this.props.heading}
                    {this.state.show ? (
                        <span className="fa icon fa-caret-down endspan-icon" />
                    ) : (
                        <span className="fa icon fa-caret-right endspan-icon" />
                    )}
                </div>
                <Collapse isOpen={this.state.show}>
                    <ListGroup>{stopItems}</ListGroup>
                </Collapse>
            </div>
        );
    }
}

SearchDirection.propTypes = propTypes;
