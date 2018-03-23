import React from 'react';
import SearchBar from './controls/SearchBar';
import StopHolder from './controls/StopHolder';
import SearchModal from './controls/SearchModal';
import { COOKIE } from '../util/Constants'
import axios from 'axios';
import Cookies from 'universal-cookie';

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
        const cookies = new Cookies();
        const stopIds = cookies.get(COOKIE) || [];
        const stopSet = new Set(stopIds);
        this.state = {
            stopIds,
            stopSet,
            stopCache: {},
            cookies,
        };
        this.search = this.search.bind(this);
        this.appendStop = this.appendStop.bind(this);
        this.deleteStop = this.deleteStop.bind(this);
        this.clearModal = this.clearModal.bind(this);
    }

    appendStop(stopId) {
        if (!this.state.stopIds) {
            this.setState({ stopIds: [stopId] });
        }
        else {
            if (!this.state.stopSet.has(stopId)) {
                this.state.stopIds.push(stopId);
                this.state.stopSet.add(stopId);
            }
            
        }
        this.state.cookies.set(COOKIE, this.state.stopIds, { path: '/' })
        this.clearModal();
    }

    deleteStop(index) {
        const stopIds = this.state.stopIds;
        const stopSet = this.state.stopSet;
        const stopId = stopIds[index];
        stopSet.delete(stopId);
        stopIds.splice(index, 1);
        this.setState({ stopSet, stopIds })
        this.state.cookies.set(COOKIE, this.state.stopIds, { path: '/' })
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
            <StopHolder stopIds={this.state.stopIds} stopDeleter={this.deleteStop} />
            {!!this.state.currQuery && 
                <SearchModal input={this.state.currQuery} updater={this.appendStop} closer={this.clearModal} stopCache={this.state.stopCache}/>
            }
            <div className="footer-center footer-margin">For now, please visit <a href="./mappings.txt">this document</a> to find mappings between route numbers and route IDs (for searching).</div>
            <div className="footer-center">
                {"\u00a9 "} 
                <a href="https://echau18.gitlab.io" className="noul nohi">Ethan Chau</a> 
                {" 2018 "}
                <a href="https://github.com/ethch18" className="nohi"><span className="fa icon fa-github" /></a>
                {" "}
                <a href="https://gitlab.com/echau18" className="nohi"><span className="fa icon fa-gitlab" /></a>
            </div>
            <div className="footer-center">Made with <span className="fa icon fa-heart" /> in Seattle</div>
        </div>
        );
    }
}
