# Social Media App

## 📌 Overview
**social-media-app** is a fully functional **MERN stack** project, designed to provide a social media platform. Users can sign up, log in, create posts, upload images/videos, interact with posts through likes and comments, and manage their profiles. The app includes features like friend requests, profile information management, and post search. Images are uploaded to **Cloudinary** and stored in the database via links. **Redux Toolkit** is used for state management, and **Netlify** is used for hosting the frontend.

## 🚀 Features
### **User Authentication & Profile**
- 🔑 **Sign Up & Login** (JWT-based authentication)  
- ✉️ **Email Verification**  
- 👤 **Profile Management** (Add, Edit Profile Information)  
- 📸 **Profile Image Upload** (Images are stored in Cloudinary)  
- 🔄 **Update Profile Information**  

### **Post Creation & Interactions**
- 📝 **Create Posts** (Text, Image, Video)  
- ❤️ **Like Posts**  
- 💬 **Comment on Posts**  
- 🔁 **Reply to Comments**  
- 🔍 **Search Posts & Users**  
- 👥 **Friend Request** (Send & Accept)  
- 👥 **Suggested Friends** based on user activity

### **Additional Features**
- 🎯 **Post search** to find content and users  
- 📬 **Friend Requests** to send and receive friend invitations  
- 🧑‍🤝‍🧑 **Friend Suggestions** for users based on mutual interests and activity
- ✅  **dark** mode


## 🚀 Deployment


## 🛠️ Technologies Used
- **Frontend**  
  - React.js  
  - Redux Toolkit (State Management)  
  - Tailwind CSS (Styling)  
  - React Router (Routing)  

- **Backend**  
  - Node.js & Express.js  
  - MongoDB & Mongoose  
  - JWT Authentication  
  - Cloudinary (Image & Video Hosting)  
  - Nodemailer (Email Verification)  

- **DevOps & Hosting**  
  - Netlify (Frontend)  
  - Render (Backend)

  
### **Frontend**
The frontend of this project is hosted on **Netlify**. You can access it here:  
🔗 [Live Demo](https://rvibe.netlify.app/)

## 📸 Screenshots

###  Home Page
![Home Page](https://res.cloudinary.com/dp0zdj77w/image/upload/v1742369086/forReadme/Screenshot_2025-03-19_132426_lh3zh7.png)

## 📂 Folder Structure
```
social-media-app/
│── client/          # Frontend code (React-based)
│── server/          # Backend code (Node.js & Express)
│── README.md        # Documentation
```

## 🔑 Environment Variables
Create a `.env` file in the **server** folder and add:

```
MONGODB_PASSWORD=your_mongodb_password
MONGODB_URI=mongodb+srv://your_mongodb_user:your_mongodb_password@cluster0.mongodb.net/your_database_name
PORT=8800
APP_URL=http://localhost:8800  # Your backend URL
FRONTEND_URL=http://localhost:3000  # Your frontend URL
MAIL_SERVICE=your_mail_service  # e.g., 'gmail'
MAIL_PORT=465
MAIL_USERNAME=your_email_address
MAIL_PASSWORD=your_email_password
JWT_SECRET_KEY=your_jwt_secret_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

## 🚀 How to Run Locally
1. **Clone the repository**
   ```sh
   git clone https://github.com/abdullah116632/social-media-app.git
   cd social-media-app
   ```

2. **Install dependencies for each service**
   ```sh
   cd server && npm install
   cd ../client && npm install
   ```

3. **Run the backend server**
   ```sh
   cd server
   npm start
   ```

4. **Run the frontend (client)**
   ```sh
   cd ../client
   npm start
   ```

5. **Access the App**
   - **Frontend (User Interface)**: `http://localhost:3000`
   - **Backend (API Server)**: `http://localhost:5000`

## 🛠️ API Endpoints

### Authentication Routes (`/auth`)
- `POST /register` - Register a new user
- `POST /login` - Log in an existing user
- `POST /generate-signature` - Generate a user signature (for secure requests)

### Post Routes (`/posts`)
- `POST /create-post` - Create a new post (requires user authentication)
- `POST /` - Get all posts (requires user authentication)
- `POST /:id` - Get a specific post by ID (requires user authentication)
- `POST /get-user-post/:id` - Get posts by a specific user (requires user authentication)
- `GET /comments/:postId` - Get all comments for a post
- `POST /like/:id` - Like a post (requires user authentication)
- `POST /like-comment/:id/:rid?` - Like a comment or reply (requires user authentication)
- `POST /comment/:id` - Comment on a post (requires user authentication)
- `POST /reply-comment/:id` - Reply to a comment (requires user authentication)
- `DELETE /:id` - Delete a post by ID (requires user authentication)

### Search Routes (`/search`)
- `GET /` - Basic search functionality (requires user authentication)

### User Routes (`/users`)
- `GET /get-user/:id?` - Get user details by ID (requires user authentication)
- `PUT /update-user` - Update user details (requires user authentication)
- `POST /friend-request` - Send a friend request (requires user authentication)
- `POST /get-friend-request` - Get all incoming friend requests (requires user authentication)
- `POST /get-requested-friend-request` - Get all sent friend requests (requires user authentication)
- `POST /cancel-friend-request` - Cancel a sent friend request (requires user authentication)
- `POST /accept-request` - Accept a friend request (requires user authentication)
- `POST /profile-view` - View a user's profile (requires user authentication)
- `POST /suggested-friends` - Get a list of suggested friends (requires user authentication)
- `GET /verified` - Check if the user is verified

### Password Routes (`/users`)
- `POST /request-passwordreset` - Request a password reset (via email)
- `POST /reset-password` - Reset password with token
- `POST /change-password` - Change password (requires user authentication)

### Email Verification (`/users`)
- `GET /verify/:userId/:token` - Verify a user's email address with a token

### Route Setup in `server.js`
- `app.use("/auth", authRoute);` - Authentication routes
- `app.use("/users", userRoute);` - User routes
- `app.use("/posts", postRoute);` - Post routes
- `app.use("/search", searchRoute);` - Search routes


## 📜 License
This project is open-source and available for learning purposes.
