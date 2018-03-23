import React from 'react';
import PropTypes from 'prop-types';
import StopView from './StopView';
import { Col, Container, Row } from 'reactstrap';

const propTypes = {
    stopIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    stopDeleter: PropTypes.func.isRequired,
};

export default class StopHolder extends React.Component {
    constructor(props) {
        super(props);
        this.views = [];
        this.refreshAll.bind(this);
    }

    refreshAll() {
        for (let view of this.views) {
            view.conditionalRefresh();
        }
    }
    
    render() {
        const { stopIds } = this.props;
        const cols = [];
        this.views = [];
        for (let i = 0; i < stopIds.length; i++) {
            const currId = stopIds[i];
            const currView = (
                <StopView
                    stopId={currId}
                    ref={(instance) => {this.views.push(instance)}}
                    stopIndex={i}
                    stopDeleter={this.props.stopDeleter}
                 />
            );
            cols.push(
                <Col 
                    key={`view-${currId}`}    
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                >
                    {currView}
                </Col>
            )
        }

        return (
            <div>
                <span 
                    className="fa icon fa-refresh stop-refresh-all clickable"
                    onClick={() => this.refreshAll()}
                />
                <Container>
                    <Row>
                        {cols}
                    </Row>
                </Container>
            </div>
        );
    }
}

StopHolder.propTypes = propTypes;
