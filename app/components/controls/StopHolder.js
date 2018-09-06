import React from 'react';
import PropTypes from 'prop-types';
import StopView from './StopView';
import { Col, Container, Row } from 'reactstrap';

const propTypes = {
    stopIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    stopDeleter: PropTypes.func.isRequired,
    stopReorderer: PropTypes.func.isRequired,
    helpFunc: PropTypes.func.isRequired
};

function getParentColumn(element) {
    // hacky way to bump up to the droppable parent element
    let column = element;
    while (column && !column.classList.contains('stop-column')) {
        column = column.parentElement;
    }
    return column;
}

function hasParentStopContent(element) {
    // hacky way to check for a parent stop-content div
    let div = element;
    while (div) {
        if (div.classList.contains('stop-content')) {
            return true;
        }
        div = div.parentElement;
    }
    return false;
}

export default class StopHolder extends React.Component {
    constructor(props) {
        super(props);
        this.views = [];
        this.cols = [];
        this.refreshAll = this.refreshAll.bind(this);
    }

    refreshAll() {
        for (let view of this.views) {
            if (!!view) {
                view.conditionalRefresh();
            }
        }
    }

    render() {
        const { stopIds } = this.props;

        if (stopIds.length == 0) {
            return (
                <Container className="stop-getstarted-outer">
                    <div className="stop-getstarted">
                        {
                            'No stops to show yet!  Get started by searching for a route ID in the search bar or clicking '
                        }
                        <span
                            className="fa icon fa-question-circle clickable"
                            onClick={this.props.helpFunc}
                        />
                        {' for help!'}
                    </div>
                </Container>
            );
        }

        this.cols = [];
        this.views = [];
        for (let i = 0; i < stopIds.length; i++) {
            const currId = stopIds[i];
            const currView = (
                <StopView
                    stopId={currId}
                    ref={instance => {
                        this.views.push(instance);
                    }}
                    stopIndex={i}
                    stopDeleter={this.props.stopDeleter}
                />
            );
            this.cols.push(
                <Col
                    key={`view-${currId}`}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    className={'stop-column'}
                    draggable="true"
                    index={i}
                    onDragStart={e => {
                        // don't allow drag in or below stop-content elements,
                        // since we need to allow scrolling
                        const allowDrag = !hasParentStopContent(
                            document.elementFromPoint(e.clientX, e.clientY)
                        );
                        console.log(allowDrag);
                        if (allowDrag) {
                            e.target.classList.add('dragged');
                            e.dataTransfer.setData('startIndex', i);
                            e.dataTransfer.effectAllowed = 'move';
                        }
                    }}
                    onDragOver={e => {
                        if (e.preventDefault) {
                            e.preventDefault();
                        }
                        e.dataTransfer.effectAllowed = 'move';
                        return false;
                    }}
                    onDragEnter={e => {
                        if (e.preventDefault()) {
                            e.preventDefault();
                        }
                        getParentColumn(e.target).classList.add('hovered');
                        e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragLeave={e => {
                        if (
                            getParentColumn(e.currentTarget) !==
                            getParentColumn(e.relatedTarget)
                        ) {
                            getParentColumn(e.target).classList.remove(
                                'hovered'
                            );
                        }
                    }}
                    onDrop={e => {
                        if (e.stopPropagation) {
                            e.stopPropagation();
                        }
                        if (e.preventDefault) {
                            e.preventDefault();
                        }

                        const column = getParentColumn(e.target);
                        const oldIndex = e.dataTransfer.getData('startIndex');
                        const newIndex = column.getAttribute('index');

                        if (oldIndex !== newIndex) {
                            this.props.stopReorderer(oldIndex, newIndex);
                        }
                        e.dataTransfer.clearData('startIndex');

                        return false;
                    }}
                    onDragEnd={e => {
                        delete e.target.style.opacity;
                        for (let child of e.target.parentElement.children) {
                            child.classList.remove('hovered');
                            child.classList.remove('dragged');
                        }
                    }}
                >
                    {currView}
                </Col>
            );
        }

        return (
            <div>
                <span
                    className="fa icon fa-refresh stop-floating-icon clickable"
                    onClick={() => this.refreshAll()}
                />
                <span
                    className="stop-floating-icon fa icon fa-question-circle clickable"
                    onClick={this.props.helpFunc}
                />
                <Container>
                    <Row>{this.cols}</Row>
                </Container>
            </div>
        );
    }
}

StopHolder.propTypes = propTypes;
