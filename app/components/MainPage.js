import React from 'react';
import HelpModal from './controls/HelpModal';
import SearchBar from './controls/SearchBar';
import StopHolder from './controls/StopHolder';
import SearchModal from './controls/SearchModal';
import { COOKIE } from '../util/Constants';
import axios from 'axios';
import Cookies from 'universal-cookie';

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
        const cookies = new Cookies();
        const stopIds = cookies.get(COOKIE) || [];
        const stopSet = new Set(stopIds);
        this.state = {
            agencyCache: {},
            routeCache: {},
            stopIds,
            stopSet,
            stopCache: {},
            cookies,
            showHelp: false
        };
        this.search = this.search.bind(this);
        this.appendStop = this.appendStop.bind(this);
        this.deleteStop = this.deleteStop.bind(this);
        this.clearModal = this.clearModal.bind(this);
        this.toggleHelp = this.toggleHelp.bind(this);
        this.reorderStop = this.reorderStop.bind(this);
    }

    toggleHelp() {
        this.setState({ showHelp: !this.state.showHelp });
    }

    appendStop(stopId) {
        if (!this.state.stopIds) {
            this.setState({ stopIds: [stopId] });
        } else {
            if (!this.state.stopSet.has(stopId)) {
                this.state.stopIds.push(stopId);
                this.state.stopSet.add(stopId);
            }
        }
        this.state.cookies.set(COOKIE, this.state.stopIds, { path: '/' });
        this.clearModal();
    }

    deleteStop(index) {
        const { stopIds, stopSet } = this.state;
        const stopId = stopIds[index];
        stopSet.delete(stopId);
        stopIds.splice(index, 1);
        this.setState({ stopSet, stopIds });
        this.state.cookies.set(COOKIE, this.state.stopIds, { path: '/' });
    }

    reorderStop(oldIndex, newIndex) {
        const { stopIds } = this.state;
        stopIds.splice(newIndex, 0, stopIds.splice(oldIndex, 1)[0]);
        this.setState({ stopIds });
        this.state.cookies.set(COOKIE, this.state.stopIds, { path: '/' });
    }

    clearModal() {
        this.setState({ currQuery: undefined });
    }

    search(query) {
        this.setState({ currQuery: query });
    }

    render() {
        return (
            <div>
                <SearchBar searchFunction={this.search} />
                <StopHolder
                    stopIds={this.state.stopIds}
                    stopDeleter={this.deleteStop}
                    stopReorderer={this.reorderStop}
                    helpFunc={this.toggleHelp}
                />
                {!!this.state.currQuery && (
                    <SearchModal
                        input={this.state.currQuery}
                        updater={this.appendStop}
                        closer={this.clearModal}
                        agencyCache={this.state.agencyCache}
                        routeCache={this.state.routeCache}
                        stopCache={this.state.stopCache}
                    />
                )}
                <div className="footer-center footer-margin">
                    {
                        'We now support searching by route number!  (Route number - ID mappings still live '
                    }
                    <a href="./mappings.txt">here</a>
                    .)
                </div>
                <div className="footer-center">
                    {'\u00a9 '}
                    <a href="https://echau18.gitlab.io" className="noul nohi">
                        Ethan Chau
                    </a>
                    {' 2018 '}
                    <a href="https://github.com/ethch18" className="nohi">
                        <span className="fa icon fa-github" />
                    </a>{' '}
                    <a href="https://gitlab.com/echau18" className="nohi">
                        <span className="fa icon fa-gitlab" />
                    </a>
                </div>
                <div className="footer-center">
                    Made with <span className="fa icon fa-heart" /> in Seattle
                </div>
                <HelpModal
                    isOpen={this.state.showHelp}
                    toggle={this.toggleHelp}
                />
            </div>
        );
    }
}
