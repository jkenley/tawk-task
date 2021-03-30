const axios = require('axios')

const getUniqWebsite = async (start, end) => {
  // fetch json data
  const response = await axios.get('https://bitbucket.org/!api/2.0/snippets/tawkto/aA8zqE/4f62624a75da6d1b8dd7f70e53af8d36a1603910/files/webstats.json')
  const dataEntries = response.data
  // filter unique website ids
  const websiteIds = dataEntries.map(o => o.websiteId)
  const uniqueWebsiteIds = [...new Set(websiteIds)]
  // sum the number of chats and missedChats
  let stats = []
  // let filteredData = []

  try {
    uniqueWebsiteIds.forEach((websiteId) => {

      const newData = {
        websiteId: websiteId,
        chats: 0,
        missedChats: 0
      }

      let filteredData = dataEntries.filter(data => data.websiteId === websiteId)

      if (start && end) {
        filteredData = filteredData.filter(item => { const date = new Date(item.date); return date >= start && date <= end; })
      }
      // reduce
      // newData.chats = filteredData.reduce((currentTotal, item) => {
      //   return item.chats + currentTotal
      // }, 0)

      // newData.missedChats = filteredData.reduce((currentTotal, item) => {
      //   return item.missedChats + currentTotal
      // }, 0)

      // forEach
      filteredData.forEach((item) => {
        newData.chats += item.chats
        newData.missedChats += item.missedChats
      })

      stats = [...stats, newData]
    })

    return stats
  } catch (error) {
    console.log(error)
    return error
  }
}

const main = async () => {
  console.log('STATS without date range filter: ')
  console.log(await getUniqWebsite())
  console.log('STATS with date range filter: ')
  console.log(await getUniqWebsite(new Date(2019, 2, 1), new Date(2019, 3, 8)))
}

main()






