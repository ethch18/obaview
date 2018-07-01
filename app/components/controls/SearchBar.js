import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'reactstrap';

const propTypes = {
    searchFunction: PropTypes.func.isRequired
};

export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.updateQuery = this.updateQuery.bind(this);
        this.submitQuery = this.submitQuery.bind(this);
    }

    updateQuery(event) {
        this.setState({ query: event.target.value });
    }

    submitQuery() {
        if (!!this.state.query) {
            this.props.searchFunction(this.state.query.trim());
        }
    }

    render() {
        return (
            <div className="searchbar-wrap">
                <Input
                    type="text"
                    placeholder="Search by route ID..."
                    onChange={this.updateQuery}
                    className="searchbar-input searchbar-content"
                    onKeyDown={event => {
                        event.keyCode == 13 && this.submitQuery();
                    }}
                />
                <div className="searchbar-button-outer searchbar-content">
                    <Button
                        className="searchbar-button-inner icon fa fa-2x fa-search"
                        onClick={() => this.submitQuery()}
                    />
                </div>
            </div>
        );
    }
}

SearchBar.propTypes = propTypes;
