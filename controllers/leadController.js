import Lead, { LEAD_STATUSES, LEAD_SOURCES } from '../models/Lead.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @module controllers/leadController
 * @description Controllers managing Lead lifecycle and aggregation statistics.
 * Every operation enforces owner isolation by scoping queries with { owner: req.user._id }.
 */

/**
 * Retrieves leads for the authenticated user with filtering, search, sorting, and pagination.
 *
 * @async
 * @function getLeads
 * @param {Object} req - Express request object.
 * @param {Object} req.query - Query parameters.
 * @param {string} [req.query.status] - Filter by status (e.g. 'New', 'Contacted').
 * @param {string} [req.query.search] - Search name, company, or email.
 * @param {string} [req.query.source] - Filter by source (e.g. 'Website', 'LinkedIn').
 * @param {string} [req.query.dateFrom] - Start date filter (ISO string or date string).
 * @param {string} [req.query.dateTo] - End date filter (ISO string or date string).
 * @param {number|string} [req.query.page=1] - Active page index (1-indexed).
 * @param {number|string} [req.query.limit=20] - Number of records per page.
 * @param {string} [req.query.sortBy='createdAt'] - Lead field to sort by.
 * @param {string} [req.query.sortOrder='desc'] - Sort order direction ('asc' or 'desc').
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 * @returns {Promise<void>}
 */
export const getLeads = async (req, res, next) => {
  try {
    const {
      status,
      search,
      source,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const filter = { owner: req.user._id };

    // Apply status filter if provided and not 'All'
    if (status && status !== 'All') {
      filter.status = status;
    }

    // Apply source filter if provided and not 'All'
    if (source && source !== 'All') {
      filter.source = source;
    }

    // Apply text search on name, company, or email (case-insensitive regex)
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      filter.$or = [
        { name: searchRegex },
        { company: searchRegex },
        { email: searchRegex },
      ];
    }

    // Apply date range filters on createdAt
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    const numericPage = Math.max(1, parseInt(page, 10) || 1);
    const numericLimit = Math.max(1, parseInt(limit, 10) || 20);
    const sortByField = sortBy || 'createdAt';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortByField]: sortDirection };

    console.log(`[getLeads] Fetching leads for user ${req.user._id} | filter:`, filter);

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort(sort)
        .skip((numericPage - 1) * numericLimit)
        .limit(numericLimit),
      Lead.countDocuments(filter),
    ]);

    const pages = Math.ceil(total / numericLimit) || 1;
    const hasNext = numericPage < pages;
    const hasPrev = numericPage > 1;

    return res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: numericPage,
        limit: numericLimit,
        pages,
        hasNext,
        hasPrev,
      },
    });
  } catch (error) {
    console.error('[getLeads] Error:', error.message);
    next(error);
  }
};

/**
 * Creates a new lead owned by the authenticated user.
 *
 * @async
 * @function createLead
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const createLead = async (req, res, next) => {
  try {
    const { name, company, email, phone, status, source, notes } = req.body;
    console.log(`[createLead] Creating lead for user ${req.user._id}`);

    const newLead = await Lead.create({
      name,
      company,
      email,
      phone,
      status,
      source,
      notes,
      owner: req.user._id,
    });

    return successResponse(res, newLead, 'Lead created successfully', 201);
  } catch (error) {
    console.error('[createLead] Error:', error.message);
    next(error);
  }
};

/**
 * Retrieves a single lead by its ID, scoped to the authenticated user.
 *
 * @async
 * @function getLeadById
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`[getLeadById] Fetching lead ID: ${id} for user ${req.user._id}`);

    const lead = await Lead.findOne({ _id: id, owner: req.user._id });
    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, lead, 'Lead retrieved successfully', 200);
  } catch (error) {
    console.error('[getLeadById] Error:', error.message);
    next(error);
  }
};

/**
 * Updates a lead by ID, scoped to the authenticated user. Prevents owner modification.
 *
 * @async
 * @function updateLead
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`[updateLead] Updating lead ID: ${id} for user ${req.user._id}`);

    const updateData = { ...req.body };
    // DO NOT allow changing the owner field under any circumstance
    delete updateData.owner;

    const updatedLead = await Lead.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, updatedLead, 'Lead updated successfully', 200);
  } catch (error) {
    console.error('[updateLead] Error:', error.message);
    next(error);
  }
};

/**
 * Updates only the status of a lead by ID, scoped to the authenticated user.
 *
 * @async
 * @function updateLeadStatus
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`[updateLeadStatus] Updating status of lead ID: ${id} to "${status}" for user ${req.user._id}`);

    // Validate that status exists and is a valid enum value
    if (!status || !LEAD_STATUSES.includes(status)) {
      return errorResponse(res, `Invalid status. Must be one of: ${LEAD_STATUSES.join(', ')}`, 400);
    }

    const updatedLead = await Lead.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, updatedLead, 'Lead status updated successfully', 200);
  } catch (error) {
    console.error('[updateLeadStatus] Error:', error.message);
    next(error);
  }
};

/**
 * Deletes a lead by ID, scoped to the authenticated user.
 *
 * @async
 * @function deleteLead
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`[deleteLead] Deleting lead ID: ${id} for user ${req.user._id}`);

    const lead = await Lead.findOne({ _id: id, owner: req.user._id });
    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    await lead.deleteOne();

    return successResponse(res, { message: 'Lead deleted successfully' }, 'Lead deleted successfully', 200);
  } catch (error) {
    console.error('[deleteLead] Error:', error.message);
    next(error);
  }
};

/**
 * Computes high-level KPI lead pipeline stats using MongoDB Aggregation framework ($facet).
 * Returns metrics in a SINGLE database query.
 *
 * @async
 * @function getLeadStats
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const getLeadStats = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    console.log(`[getLeadStats] Aggregating pipeline stats for user ${ownerId}`);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-indexed for aggregation matching

    const lastMonthDate = new Date();
    lastMonthDate.setMonth(now.getMonth() - 1);
    const lastMonthYear = lastMonthDate.getFullYear();
    const lastMonthNum = lastMonthDate.getMonth() + 1;

    const statsResult = await Lead.aggregate([
      { $match: { owner: ownerId } },
      {
        $facet: {
          totalCount: [
            { $count: 'count' }
          ],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          bySource: [
            { $group: { _id: '$source', count: { $sum: 1 } } }
          ],
          byMonth: [
            {
              $project: {
                isThisMonth: {
                  $cond: [
                    {
                      $and: [
                        { $eq: [{ $year: '$createdAt' }, currentYear] },
                        { $eq: [{ $month: '$createdAt' }, currentMonth] }
                      ]
                    },
                    1,
                    0
                  ]
                },
                isLastMonth: {
                  $cond: [
                    {
                      $and: [
                        { $eq: [{ $year: '$createdAt' }, lastMonthYear] },
                        { $eq: [{ $month: '$createdAt' }, lastMonthNum] }
                      ]
                    },
                    1,
                    0
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                thisMonthCount: { $sum: '$isThisMonth' },
                lastMonthCount: { $sum: '$isLastMonth' }
              }
            }
          ]
        }
      }
    ]);

    const result = statsResult[0] || {};
    const totalLeads = result.totalCount?.[0]?.count || 0;

    // Initialize all status breakdown keys
    const statusBreakdown = {
      New: 0,
      Contacted: 0,
      'Meeting Scheduled': 0,
      'Proposal Sent': 0,
      Won: 0,
      Lost: 0,
    };
    if (result.byStatus) {
      result.byStatus.forEach(item => {
        if (item._id) {
          statusBreakdown[item._id] = item.count;
        }
      });
    }

    // Initialize all source breakdown keys
    const sourceBreakdown = {
      Website: 0,
      Referral: 0,
      LinkedIn: 0,
      'Cold Call': 0,
      'Email Campaign': 0,
      Other: 0,
    };
    if (result.bySource) {
      result.bySource.forEach(item => {
        if (item._id) {
          sourceBreakdown[item._id] = item.count;
        }
      });
    }

    const wonLeads = statusBreakdown['Won'] || 0;
    const conversionRate = totalLeads > 0
      ? parseFloat(((wonLeads / totalLeads) * 100).toFixed(1))
      : 0.0;

    const thisMonthLeads = result.byMonth?.[0]?.thisMonthCount || 0;
    const lastMonthLeads = result.byMonth?.[0]?.lastMonthCount || 0;

    // Calculate growth rate safely
    let growthRate = 0.0;
    if (lastMonthLeads > 0) {
      growthRate = parseFloat((((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100).toFixed(1));
    } else if (thisMonthLeads > 0) {
      growthRate = 100.0;
    } else {
      growthRate = 0.0;
    }

    const statsObj = {
      totalLeads,
      statusBreakdown,
      conversionRate,
      sourceBreakdown,
      thisMonthLeads,
      lastMonthLeads,
      growthRate,
    };

    return successResponse(res, statsObj, 'Lead statistics retrieved successfully', 200);
  } catch (error) {
    console.error('[getLeadStats] Error:', error.message);
    next(error);
  }
};

/**
 * Aggregates monthly registration trends for the last 6 months.
 * Guarantees a continuous 6-month sequence even if some months have 0 leads.
 * Output sorted from oldest to newest.
 *
 * @async
 * @function getMonthlyStats
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const getMonthlyStats = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    console.log(`[getMonthlyStats] Generating monthly trends for user ${ownerId}`);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyData = await Lead.aggregate([
      {
        $match: {
          owner: ownerId,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: 1 },
          won: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Won'] }, 1, 0]
            }
          },
          lost: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);

    // Create full 6-month array template chronologically
    const monthsList = [];
    const tempDate = new Date(sixMonthsAgo);
    for (let i = 0; i < 6; i++) {
      const monthName = tempDate.toLocaleString('default', { month: 'short' });
      const year = tempDate.getFullYear();
      monthsList.push({
        year,
        monthNum: tempDate.getMonth() + 1,
        month: `${monthName} ${year}`,
        total: 0,
        won: 0,
        lost: 0,
        conversionRate: 0.0,
      });
      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    // Merge actual database aggregates with the template structure
    monthlyData.forEach(data => {
      const match = monthsList.find(m => m.year === data._id.year && m.monthNum === data._id.month);
      if (match) {
        match.total = data.total;
        match.won = data.won;
        match.lost = data.lost;
        match.conversionRate = data.total > 0
          ? parseFloat(((data.won / data.total) * 100).toFixed(1))
          : 0.0;
      }
    });

    const formattedResult = monthsList.map(m => ({
      month: m.month,
      total: m.total,
      won: m.won,
      lost: m.lost,
      conversionRate: m.conversionRate,
    }));

    return successResponse(res, formattedResult, 'Monthly lead stats retrieved successfully', 200);
  } catch (error) {
    console.error('[getMonthlyStats] Error:', error.message);
    next(error);
  }
};

/**
 * Quick autocomplete search endpoint for debounced queries.
 * Returns only _id, name, company, email, and status. Limits count to 5.
 *
 * @async
 * @function searchLeads
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 * @returns {Promise<void>}
 */
export const searchLeads = async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;
    const numericLimit = Math.min(20, Math.max(1, parseInt(limit, 10) || 5));

    if (!q || !q.trim()) {
      return successResponse(res, [], 'Search query is empty', 200);
    }

    const query = {
      owner: req.user._id,
      $or: [
        { name: { $regex: q.trim(), $options: 'i' } },
        { company: { $regex: q.trim(), $options: 'i' } },
        { email: { $regex: q.trim(), $options: 'i' } }
      ]
    };

    const leads = await Lead.find(query)
      .select('_id name company email status')
      .limit(numericLimit);

    return successResponse(res, leads, 'Leads searched successfully', 200);
  } catch (error) {
    console.error('[searchLeads] Error:', error.message);
    next(error);
  }
};
