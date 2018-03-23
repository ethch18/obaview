import requests
import time
from secret import KEY

BASE_URL = 'http://api.pugetsound.onebusaway.org/api/where/'
AGENCY_URL = 'agencies-with-coverage'
ROUTE_ID_URL = 'route-ids-for-agency/'
ROUTE_DETAIL_URL = 'route/'

def main():
    all_agency_url = '{0}{1}.json?key={2}'.format(BASE_URL, AGENCY_URL, KEY)
    all_agency_raw = requests.get(all_agency_url).json()
    all_agency_data = all_agency_raw['data']['references']['agencies']

    agency_name_map = {agency['id']:agency['name'] for agency in all_agency_data}
    agency_routes_map = {}
    route_id_map = {}

    for agency in agency_name_map:
        print('Processing: {0} ({1})'.format(agency, agency_name_map[agency]))
        agency_detail_url = '{0}{1}{2}.json?key={3}'.format(BASE_URL, ROUTE_ID_URL, agency, KEY)
        agency_detail_raw = requests.get(agency_detail_url).json()
        while agency_detail_raw['code'] != 200:
            print('\t error on agency detail, waiting and trying again...')
            time.sleep(1.5)
            print('\t trying again...')
            agency_detail_raw = requests.get(agency_detail_url).json()

        agency_detail_data = agency_detail_raw['data']['list']
        agency_routes_map[agency] = agency_detail_data
        for route_id in agency_detail_data:
            print('\t Processing route ID {0}'.format(route_id))
            route_detail_url = '{0}{1}{2}.json?key={3}'.format(BASE_URL, ROUTE_DETAIL_URL, route_id, KEY)
            route_detail_raw = requests.get(route_detail_url).json()
            while route_detail_raw['code'] != 200:
                print('\t error on route detail, waiting and trying again...')
                time.sleep(1.5)
                print('\t trying again...')
                route_detail_raw = requests.get(route_detail_url).json()
        
            route_shortname = route_detail_raw['data']['entry']['shortName']
            route_longname = route_detail_raw['data']['entry']['longName']
            if not route_longname:
                route_longname = route_detail_raw['data']['entry']['description']

            if not route_shortname:
                route_descrip = route_longname
            elif not route_longname:
                route_descrip = route_shortname
            else:
                route_descrip = route_shortname + ' - ' + route_longname
            route_id_map[route_id] = route_descrip
    
    with open('mappings.txt', 'w') as outfile:
        for agency in agency_name_map:
            outfile.write(agency_name_map[agency])
            outfile.write('\n')
            for route_id in agency_routes_map[agency]:
                outfile.write('\t{0}\t{1}'.format(route_id, route_id_map[route_id]))
                outfile.write('\n')





if __name__ == '__main__':
    main()
