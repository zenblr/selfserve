import strftime from 'strftime'
import _ from 'lodash'

export function flattenAssetAggregations(arr) {
  function switchOnGranularity(key, id, aggs = {}) {
    switch (key) {
      //case 'per-minute':
      case 'PT1M':
        aggs.perMinute = id
        break
      //case 'per-hour':
      case 'PT1H':
        aggs.perHour = id
        break
      //case 'per-day':
      case 'P1D':
        aggs.perDay = id
        break
      default:
        //Don't set anything.
    }
  }

  return arr.reduce(function(entry, curr) {
    let key = curr.entityId + curr.channelKey
    //let functionKey = curr.function.key
    let functionKey = curr.period
    let id = curr.id

    if(!entry[key] || !entry[key].aggregations
        || !(Object.keys(entry[key].aggregations).length > 0)) {
      entry[key] = {
        entityId: curr.entityId,
        entity: curr.entity,
        name: curr.entityName,
        label: curr.unit.label,
        channelKey: curr.channelKey,
        channelName: curr.channelName,
        aggregations: {}
      }
    }
    switchOnGranularity(functionKey, id, entry[key].aggregations)
    return entry
  },{})
}

// Example return values: '2014-03-29T01:00:00-07:00'
export function getSelectedDateRangeString(state) {
  return {
    startDate: dateStringFromObject(state.navbar.startDate),
    endDate: dateStringFromObject(state.navbar.endDate)
  }
}

export function dateStringFromObject(dateObject) {
  return strftime('%Y-%m-%dT%T%:z', new Date(dateObject.year, dateObject.month - 1,
    dateObject.day, dateObject.hour, dateObject.minute))
}

/**
 * This function will take the raw payload from the response of a label tree called KPI
 * and return the location structure of the dashboard state.
 *
 * @param payload
 * @returns {{}}
 */
export function extractKpiLocations(payload) {
  let locations = []
  const tempLoc = payload.children
  if(tempLoc && _.isArray(tempLoc)) {
    locations = tempLoc.map(l => {
      return {
        id: l.node.id,
        name: l.node.name,
        reliability: 99,
        min: 96
      }
    })
  }
  return locations
}

// index - index of location in locations.
export function extractKpiCards(payload, index) {
  const locations = payload.children
  let result = []

  if (locations && _.isArray(locations)) {
    result = locations[index].children.filter(f => f.node.name !== 'Reliability').map(k => {
      return {
        id: k.node.id,
        name: k.node.name,
        selectedMiniCard: 0,
        miniCards: k.children?k.children.map(mc => {
          return {
            id: mc.node.id,
            name: mc.node.name,
            target: '---',
            unitLabel: '',
            min: '',
            max: ''
          }
        }):[]
      }
    })

  }
  return result
}

export function extractReliability(payload, index) {
  const locations = payload.children
  let result = []

  if (locations && _.isArray(locations)) {
    result = locations[index].children.filter(f => f.node.name === 'Reliability').map(k => {
      return {
        id: k.node.id,
        name: k.node.name
      }
    })
  }
  return result[0]
}

export function decodeHtmlEntity(input) {
  var e = document.createElement('div')
  e.innerHTML = input
  return e.childNodes[0].nodeValue
}

/**
 * This function will extract filter the search results from the analtycs page,
 * making sure we are never showing options outside the 2 unit label max.
 *
 * @param assets
 * @returns {{}}
 */
export function filterVisibleResults(assets, selectedUnitLabels, filter) {
  let totalMatches = 0
  const regex = new RegExp(filter, 'i')  // Case insensitve
  let result = {}
  if (assets) {
    Object.keys(assets).forEach(key => {
      const asset = assets[key]
      if ((selectedUnitLabels.size < 2 || selectedUnitLabels.includes(asset.label)) &&
          asset.name.search(regex) > -1) {
        totalMatches++
        asset.enabled = true
      } else {
        asset.enabled = false
      }
      result[key] = asset
    })
  }
  return {result: result, count: totalMatches}
}

/**
 * This function will modify the aggregation names coming back from the API for display
 * purposes.
 * @param item
 * @returns modified name
 */
export function formatAggregationNames(item) {
  let n
  //The name of the entity needs to be modified following these magical rules...
  if(item.get('entity') === 'LABELGROUP' || item.get('entity') === 'LABEL') {
    let name = item.get('name').trim()
    name = ',' + name
    let modname = name.replace(/,([^:]*):/g,":")
    modname = modname[0] === ':' || modname[0] === ','?modname.slice(1):modname
    n = modname + ':' + item.get('channelKey')
  } else if(item.get('entity') === 'ASSET') {
    n = item.get('name').trim() + ':' + item.get('channelName')
  }
  return n
}