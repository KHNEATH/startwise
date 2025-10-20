const { getPool } = require('./db');

// Admin Dashboard Analytics
const getAdminDashboardStats = async () => {
  try {
    const pool = getPool();
    if (!pool) throw new Error('Database not configured');

    // User statistics
    const [totalUsers] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [newUsersToday] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = CURDATE()');
    const [newUsersThisWeek] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)');
    const [usersByRole] = await pool.execute('SELECT role, COUNT(*) as count FROM users GROUP BY role');

    // Job statistics
    const [totalJobs] = await pool.execute('SELECT COUNT(*) as count FROM jobs');
    const [activeJobs] = await pool.execute('SELECT COUNT(*) as count FROM jobs'); // All jobs are considered active since no status column
    const [jobsPostedToday] = await pool.execute('SELECT COUNT(*) as count FROM jobs WHERE DATE(created_at) = CURDATE()');
    const [jobsByType] = await pool.execute('SELECT type, COUNT(*) as count FROM jobs GROUP BY type');

    // Application statistics
    const [totalApplications] = await pool.execute('SELECT COUNT(*) as count FROM applications');
    const [applicationsToday] = await pool.execute('SELECT COUNT(*) as count FROM applications WHERE DATE(created_at) = CURDATE()');
    const [applicationsByStatus] = await pool.execute('SELECT status, COUNT(*) as count FROM applications GROUP BY status');

    // Recent activity
    const [recentUsers] = await pool.execute('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5');
    const [recentJobs] = await pool.execute('SELECT id, title, company, location, created_at FROM jobs ORDER BY created_at DESC LIMIT 5');
    const [recentApplications] = await pool.execute('SELECT id, job_title, company, applicant_name, created_at FROM applications ORDER BY created_at DESC LIMIT 5');

    return {
      users: {
        total: totalUsers[0].count,
        newToday: newUsersToday[0].count,
        newThisWeek: newUsersThisWeek[0].count,
        byRole: usersByRole,
        recent: recentUsers
      },
      jobs: {
        total: totalJobs[0].count,
        active: activeJobs[0].count,
        postedToday: jobsPostedToday[0].count,
        byType: jobsByType,
        recent: recentJobs
      },
      applications: {
        total: totalApplications[0].count,
        today: applicationsToday[0].count,
        byStatus: applicationsByStatus,
        recent: recentApplications
      }
    };
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    throw error;
  }
};

// User Management Functions
const getAllUsers = async (page = 1, limit = 20, search = '', role = '') => {
  try {
    const pool = getPool();
    if (!pool) throw new Error('Database not configured');
    const offset = (page - 1) * limit;
    let query = 'SELECT id, username, email, first_name, last_name, role, account_status, email_verified, last_login_at, created_at FROM users';
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    let params = [];
    let conditions = [];

    if (search) {
      conditions.push('(username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (role) {
      conditions.push('role = ?');
      params.push(role);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

  const [users] = await pool.execute(query, params);
  const [countResult] = await pool.execute(countQuery, params.slice(0, -2)); // Remove limit and offset for count

    return {
      users,
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Job Management Functions
const getAllJobs = async (page = 1, limit = 20, search = '', status = '') => {
  try {
    const pool = getPool();
    if (!pool) throw new Error('Database not configured');
    const offset = (page - 1) * limit;
    let query = 'SELECT id, title, company, location, type, created_at FROM jobs';
    let countQuery = 'SELECT COUNT(*) as total FROM jobs';
    let params = [];
    let conditions = [];

    if (search) {
      conditions.push('(title LIKE ? OR company LIKE ? OR location LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

  const [jobs] = await pool.execute(query, params);
  const [countResult] = await pool.execute(countQuery, params.slice(0, -2));

    return {
      jobs,
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

// Application Management Functions
const getAllApplications = async (page = 1, limit = 20, status = '') => {
  try {
    const pool = getPool();
    if (!pool) throw new Error('Database not configured');
    const offset = (page - 1) * limit;
    let query = 'SELECT id, job_title, company, applicant_name, applicant_email, status, created_at FROM applications';
    let countQuery = 'SELECT COUNT(*) as total FROM applications';
    let params = [];

    if (status) {
      query += ' WHERE status = ?';
      countQuery += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

  const [applications] = await pool.execute(query, params);
  const [countResult] = await pool.execute(countQuery, params.slice(0, -2));

    return {
      applications,
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

// System Settings Management
const getSystemSettings = async () => {
  try {
    const pool = getPool();
    if (!pool) throw new Error('Database not configured');
    const [settings] = await pool.execute('SELECT setting_key, setting_value, setting_type, description, is_public FROM system_settings ORDER BY setting_key');
    return settings;
  } catch (error) {
    console.error('Error fetching system settings:', error);
    throw error;
  }
};

const updateSystemSetting = async (key, value, adminId) => {
  try {
    const pool = getPool();
    if (!pool) throw new Error('Database not configured');
    await pool.execute('UPDATE system_settings SET setting_value = ?, updated_by = ? WHERE setting_key = ?', [value, adminId, key]);
    
    // Log admin activity
    await logAdminActivity(adminId, 'update_setting', 'system', null, { setting_key: key, new_value: value });
    
    return true;
  } catch (error) {
    console.error('Error updating system setting:', error);
    throw error;
  }
};

// Admin Activity Logging
const logAdminActivity = async (adminId, action, targetType, targetId, details, ipAddress = null, userAgent = null) => {
  try {
    const pool = getPool();
    if (!pool) {
      // If DB not configured, skip logging
      return;
    }
    await pool.execute(
      'INSERT INTO admin_activity_log (admin_id, action, target_type, target_id, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [adminId, action, targetType, targetId, JSON.stringify(details), ipAddress, userAgent]
    );
  } catch (error) {
    console.error('Error logging admin activity:', error);
  }
};

// User Management Actions
const updateUserStatus = async (userId, status, adminId) => {
  try {
    const pool = getPool();
    if (!pool) throw new Error('Database not configured');
    await pool.execute('UPDATE users SET account_status = ? WHERE id = ?', [status, userId]);
    await logAdminActivity(adminId, 'update_user_status', 'user', userId, { new_status: status });
    return true;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

const deleteUser = async (userId, adminId) => {
  try {
    const pool = getPool();
    if (!pool) throw new Error('Database not configured');
    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
    await logAdminActivity(adminId, 'delete_user', 'user', userId, {});
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Analytics Functions
const recordAnalytic = async (metricName, metricValue, metricType = 'counter', dimensions = {}) => {
  try {
    const pool = getPool();
    if (!pool) return; // Skip analytics when DB not configured
    await pool.execute(
      'INSERT INTO analytics (metric_name, metric_value, metric_type, dimensions) VALUES (?, ?, ?, ?)',
      [metricName, metricValue, metricType, JSON.stringify(dimensions)]
    );
  } catch (error) {
    console.error('Error recording analytic:', error);
  }
};

module.exports = {
  getAdminDashboardStats,
  getAllUsers,
  getAllJobs,
  getAllApplications,
  getSystemSettings,
  updateSystemSetting,
  logAdminActivity,
  updateUserStatus,
  deleteUser,
  recordAnalytic
};