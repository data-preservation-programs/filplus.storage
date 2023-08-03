module.exports = () => {
  return [

    {
      $match: {
        $and: [
          { kyc: { $exists: true, $nin: [null] } },
          { $expr: { $eq: ['$kyc.event', 'success'] } }
        ]
      }
    },

    {
      $project: {
        _id: false,
        user: {
          $ifNull: ['$kyc.data.custom.identifier', 'Github username missing']
        },
        submissionDate: {
          $ifNull: ['$kyc.data.kyc.createdAt', '$kyc.webhookResponseTimestamp', 'Timestamp missing']
        }
      }
    }

  ]
}
