import pool from '../config/db.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, status, deadline } = req.body;
    const userId = req.user.id;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (deadline) {
      const parsedDate = Date.parse(deadline);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ message: 'Invalid deadline date format' });
      }
    }

    const taskStatus = status || 'pending';
    const taskDeadline = deadline || null;

    const [result] = await pool.query(
      'INSERT INTO tasks (user_id, title, description, status, deadline) VALUES (?, ?, ?, ?, ?)',
      [userId, title.trim(), description || null, taskStatus, taskDeadline]
    );

    return res.status(201).json({
      message: 'Task created successfully',
      task: {
        id: result.insertId,
        user_id: userId,
        title,
        description,
        status: taskStatus,
        deadline: taskDeadline
      }
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, search } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const offset = (page - 1) * limit;

    let baseQuery = ' FROM tasks WHERE user_id = ?';
    const queryParams = [userId];

    if (status && ['pending', 'in-progress', 'done'].includes(status)) {
      baseQuery += ' AND status = ?';
      queryParams.push(status);
    }

    if (search && search.trim() !== '') {
      baseQuery += ' AND title LIKE ?';
      queryParams.push(`%${search.trim()}%`);
    }

    // 1. Get total count
    const countQuery = `SELECT COUNT(*) as total` + baseQuery;
    const [countResult] = await pool.query(countQuery, queryParams);
    const totalTasks = countResult[0].total;
    const totalPages = Math.max(1, Math.ceil(totalTasks / limit));

    // 2. Get paginated tasks
    let selectQuery = `SELECT *` + baseQuery + ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const [tasks] = await pool.query(selectQuery, [...queryParams, limit, offset]);

    return res.status(200).json({
      tasks,
      pagination: {
        totalTasks,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, description, status, deadline } = req.body;

    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }

    // Build update query dynamically based on provided fields
    const updates = [];
    const queryParams = [];

    if (title !== undefined) {
      updates.push('title = ?');
      queryParams.push(title.trim());
    }
    if (description !== undefined) {
      updates.push('description = ?');
      queryParams.push(description || null);
    }
    if (status !== undefined) {
      if (!['pending', 'in-progress', 'done'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      updates.push('status = ?');
      queryParams.push(status);
    }
    if (deadline !== undefined) {
      if (deadline !== null) {
        const parsedDate = Date.parse(deadline);
        if (isNaN(parsedDate)) {
          return res.status(400).json({ message: 'Invalid deadline date format' });
        }
      }
      updates.push('deadline = ?');
      queryParams.push(deadline || null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Append id and userId to query parameters
    queryParams.push(id, userId);

    const [result] = await pool.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
      queryParams
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    return res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
