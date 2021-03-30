const axios = require('axios')
const url = 'https://bitbucket.org/!api/2.0/snippets/tawkto/aA8zqE/4f62624a75da6d1b8dd7f70e53af8d36a1603910/files/webstats.json'

const compTotalWebStats = (webIds, data, startDate, endDate) => {
  let stats = []
  let newData = {}

  webIds.forEach((websiteId) => {

    newData = {
      websiteId: websiteId,
      totalNumberOfChats: 0,
      totalNumberOfMissedChats: 0
    }

    let filteredData = data.filter(data => data.websiteId === websiteId)

    if (startDate && endDate) {
      filteredData = filteredData.filter(item => { const date = new Date(item.date); return date >= startDate && date <= endDate; })
    }

    // forEach
    filteredData.forEach((item) => {
      newData.totalNumberOfChats += item.chats
      newData.totalNumberOfMissedChats += item.missedChats
    })

    stats.push(newData)
  })

  return stats
}

const websiteStats = async (startDate, endDate) => {
  try {
    // fetch json data
    const response = await axios.get(url)
    const dataEntries = response.data
    // filter unique website ids
    const websiteIds = dataEntries.map(o => o.websiteId)
    const uniqueWebsiteIds = [...new Set(websiteIds)]
    // compute the total sum of chats and missedChats
    return compTotalWebStats(uniqueWebsiteIds, dataEntries, startDate, endDate)
  } catch (error) {
    return error
  }
}

const main = async () => {
  console.log('STATS without date range filter: ')
  console.log(await websiteStats())
  console.log('STATS with date range filter: ')
  console.log(await websiteStats(new Date(2019, 2, 1), new Date(2019, 3, 8)))
}

main()