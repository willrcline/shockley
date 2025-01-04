const { bulkAddPeriods } = require('../database/period.js')

const bulkPeriods = async () => {
  try {
    await bulkAddPeriods()
  } catch (error) {
    console.error("bulkPeriods.controller error___", error)
    return {error: 'Unexpected error processing request.'}
  }
}

module.exports = {bulkPeriods}