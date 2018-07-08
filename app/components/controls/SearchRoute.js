import React from 'react';
import PropTypes from 'prop-types';
import SearchDirection from './SearchDirection';

const propTypes = {
    agencyCache: PropTypes.object.isRequired,
    agencyRefData: PropTypes.arrayOf(PropTypes.object).isRequired,
    route: PropTypes.string.isRequired,
    routeCache: PropTypes.object.isRequired,
    routeRefData: PropTypes.arrayOf(PropTypes.object).isRequired,
    stopRefData: PropTypes.arrayOf(PropTypes.object).isRequired,
    stopData: PropTypes.arrayOf(PropTypes.object).isRequired,
    stopCache: PropTypes.object.isRequired,
    updater: PropTypes.func.isRequired
};

export default function SearchRoute(props) {
    const {
        agencyCache,
        agencyRefData,
        route,
        routeCache,
        routeRefData,
        stopRefData,
        stopData,
        stopCache,
        updater
    } = props;

    let routeDescriptor;
    if (routeCache[route]) {
        routeDescriptor = routeCache[route];
    } else {
        for (let routeEntry of routeRefData) {
            let agencyName;
            if (agencyCache[routeEntry.agencyId]) {
                agencyName = agencyCache[routeEntry.agencyId];
            } else {
                for (let agencyEntry of agencyRefData) {
                    agencyCache[agencyEntry.id] = agencyEntry.name;
                    if (routeEntry.agencyId === agencyEntry.id) {
                        agencyName = agencyCache[agencyEntry.id];
                        break;
                    }
                }
            }

            const descriptor =
                routeEntry.description || `Operated by ${agencyName}`;

            routeCache[routeEntry.id] = routeEntry.shortName
                ? `${routeEntry.shortName} (${descriptor})`
                : descriptor;
            if (routeEntry.id === route) {
                routeDescriptor = routeCache[route];
                break;
            }
        }
    }

    const directions = [];
    for (let i = 0; i < stopData.length; i++) {
        const heading = stopData[i].name.name;
        const stops = stopData[i].stopIds;
        directions.push(
            <SearchDirection
                heading={heading}
                stops={stops}
                stopCache={stopCache}
                refData={stopRefData}
                updater={updater}
                key={`${heading}-${i}`}
            />
        );
    }

    return (
        <div>
            <div className="searchmodal-routename">{routeDescriptor}</div>
            <div>{directions}</div>
        </div>
    );
}

SearchRoute.propTypes = propTypes;
