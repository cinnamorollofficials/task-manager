import pool from '../config/db.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, status, deadline } = req.body;
    const userId = req.user.id;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
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
