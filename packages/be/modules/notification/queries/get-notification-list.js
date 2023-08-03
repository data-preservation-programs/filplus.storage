// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const ObjectId = require('mongoose').Types.ObjectId

// /////////////////////////////////////////////////////////////////////// Query
// -----------------------------------------------------------------------------
module.exports = (page = 1, limit = 10, userId) => {
  const skip = (page - 1) * limit
  return [

    { $match: { ownerId: ObjectId(userId) } },

    {
      $addFields: {
        sortRead: {
          $cond: {
            if: { $eq: ['$read', false] },
            then: 1,
            else: 0
          }
        }
      }
    },

    { $sort: { sortRead: -1, createdAt: -1 } },

    {
      $project: {
        read: 1,
        custom: 1,
        bucket: 1,
        createdAt: 1
      }
    },

    {
      $facet: {
        metadata: [
          { $count: 'count' },
          {
            $addFields: {
              page,
              limit,
              totalPages: {
                $ceil: { $divide: ['$count', limit] }
              }
            }
          }
        ],
        results: [
          { $skip: skip },
          { $limit: limit }
        ]
      }
    },

    {
      $project: {
        metadata: { $first: '$metadata' },
        results: '$results'
      }
    }

  ]
}
