import bcrypt from 'bcryptjs';
import pool from './config/db.js';

const seed = async () => {
  console.log('Starting database seeding...');
  try {
    // 1. Define users to seed
    const usersToSeed = [
      { email: 'john@example.com', name: 'John Doe', password: 'secretpassword' },
      { email: 'jane@example.com', name: 'Jane Doe', password: 'secretpassword' }
    ];

    // Define task structures
    const taskCategories = [
      {
        titles: [
          'Refactor Auth Controller',
          'Optimize MySQL Queries',
          'Deploy Backend to Staging',
          'Write API Documentation',
          'Setup CI/CD Pipeline',
          'Fix Memory Leaks',
          'Design Database Schema',
          'Review Pull Requests',
          'Implement JWT Token Refresh',
          'Write Unit Tests for Tasks Route',
          'Setup Express Rate Limiter',
          'Configure CORS Settings',
          'Create Docker Compose Config',
          'Log Errors to External Service',
          'Update Express Middlewares'
        ],
        description: 'Tugas teknis pengembangan backend. Optimalkan kode, pastikan standar keamanan terpenuhi, dan jalankan uji coba menyeluruh sebelum integrasi.'
      },
      {
        titles: [
          'Fix UI Alignment',
          'Implement Dark Mode Theme',
          'Optimize Image Assets',
          'Fix Search Filters in Dashboard',
          'Integrate React Context State Manager',
          'Build Responsive Mobile Navbar',
          'Add Glassmorphism Card Style',
          'Create Task Form Validation',
          'Add Micro-Animations to Buttons',
          'Set Up Tailwind CSS v4',
          'Test Frontend Accessibility',
          'Resolve React Router Rendering Issue',
          'Optimize Bundle Size',
          'Refactor Modal Components'
        ],
        description: 'Pekerjaan antarmuka pengguna frontend. Sempurnakan detail visual sesuai dengan pedoman desain Material Design 3, pastikan performa responsif.'
      },
      {
        titles: [
          'Buy Weekly Groceries',
          'Clean the Room & Studio',
          'Morning Jogging 5KM',
          'Read 15 Pages of Book',
          'Practice SQL Joins',
          'Take a Docker Crash Course',
          'Call Parents',
          'Plan Weekly Meal and Health Log',
          'Do Laundry and Clean Wardrobe',
          'Water the Plants in Garden',
          'Gym Cardio Workout',
          'Pay Electricity & Wifi Bills',
          'Clean Kitchen and Wash Dishes',
          'Walk the Dog in the Afternoon',
          'Write a Technical Blog Post',
          'Meditate 10 Minutes',
          'Prepare Lunch Box',
          'Study Javascript Event Loop',
          'Watch Vite Build Tutorial',
          'Go to the Dentist'
        ],
        description: 'Kegiatan harian pribadi dan pembelajaran mandiri. Jaga produktivitas di luar pekerjaan utama dan selesaikan tanggung jawab rutin.'
      }
    ];

    const statuses = ['pending', 'in-progress', 'done'];

    for (const u of usersToSeed) {
      const { email, name, password } = u;

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Check if user exists
      const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
      let userId;

      if (existingUsers.length > 0) {
        userId = existingUsers[0].id;
        console.log(`User ${email} already exists with ID: ${userId}.`);
        
        // Clear existing tasks for this user to make exactly 50 tasks
        await pool.query('DELETE FROM tasks WHERE user_id = ?', [userId]);
        console.log(`Cleared existing tasks for ${name}.`);
      } else {
        const [result] = await pool.query(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          [name, email, hashedPassword]
        );
        userId = result.insertId;
        console.log(`Created user ${email} with ID: ${userId}.`);
      }

      // Generate 50 random tasks
      const tasksToInsert = [];
      for (let i = 0; i < 50; i++) {
        // Pick random category
        const category = taskCategories[Math.floor(Math.random() * taskCategories.length)];
        // Pick random title
        const titleBase = category.titles[Math.floor(Math.random() * category.titles.length)];
        const title = `${titleBase} #${i + 1}`;
        const description = `${category.description} (Urutan ke-${i + 1})`;
        
        // Random status
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Random deadline (within next 30 days, or past 10 days, or null)
        let deadline = null;
        const randType = Math.random();
        if (randType > 0.2) {
          // Random date within next 30 days
          const days = Math.floor(Math.random() * 30) + 1;
          const date = new Date();
          date.setDate(date.getDate() + days);
          deadline = date.toISOString().split('T')[0];
        } else if (randType > 0.05) {
          // Random date in the past 10 days (expired)
          const days = Math.floor(Math.random() * 10) + 1;
          const date = new Date();
          date.setDate(date.getDate() - days);
          deadline = date.toISOString().split('T')[0];
        }

        tasksToInsert.push([userId, title, description, status, deadline]);
      }

      // Bulk insert tasks
      await pool.query(
        'INSERT INTO tasks (user_id, title, description, status, deadline) VALUES ?',
        [tasksToInsert]
      );

      console.log(`Successfully seeded 50 random tasks for user ${email}!`);
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
    console.log('Database connection closed.');
  }
};

seed();
