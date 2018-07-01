import React from 'react';
import PropTypes from 'prop-types';
import SearchDirection from './SearchDirection';

const propTypes = {
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
            routeCache[routeEntry.id] = `${routeEntry.shortName} (${
                routeEntry.description
            })`;
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
