# Let's Connect

**Let's Connect** is a full-stack social networking platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The platform enables users to search and add friends, manage their friend lists, and receive friend recommendations based on mutual connections.

## Features

### 1. **User Authentication**
- **JWT Authentication**: Secure user authentication using JSON Web Tokens.
- **Email Verification**: Nodemailer is used to verify user emails during the registration process.
- **Sign Up & Login**: Users can register with unique usernames and log in securely.
- **Authentication Protection**: Sessions are protected with JWT, and user data is secured.

### 2. **User Search and Friend Management**
- **Search Users**: Users can search for other registered users.
- **Send Friend Requests**: Users can send friend requests to others.
- **Accept/Reject Friend Requests**: Users can manage incoming friend requests.
- **Friend List**: Manage friends, with options to unfriend or view the list of friends.
### 3. **Friend Recommendation System**
- **Mutual Friends**: Recommends friends based on the number of mutual connections.
- **Common Interests**: Users can get recommendations based on shared interests or hobbies.
- **Recommendation Display**: Suggested friends are shown on the user dashboard.
### 4. **User Profile**
- **Profile Management**: Users can complete, update, and manage their profiles.
- **Friend Request Status**: Display whether a friend request is sent or pending.
### 5. **UI/UX Enhancements**
- **Clean Interface**: A simple, intuitive, and responsive user interface for a seamless experience.
- **Responsive Design**: Optimized for mobile, tablet, and desktop views.
- **Real-time Updates**: Get instant feedback on friend requests and actions using real-time notifications.

## Tech Stack

### **Frontend**
- **React.js**: For building dynamic user interfaces.
- **Material UI**: For UI components and layout.
- **Tailwind CSS**: For responsive design.
- **React Toast**: For toast notifications.
- **Context API**: For efficient state management across the application.

### **Backend**
- **Node.js & Express**: Server-side framework for handling routes, authentication, and business logic.
- **JWT**: For secure user authentication and authorization.
- **Nodemailer**: For email verification during the registration process.
- **RESTful API**: Efficient API to manage users, friend requests, and recommendations.
  
### **Database**
- **MongoDB**: NoSQL database for storing user and course data.

### **Other Integrations**
- **Cloudinary**: For video storage and streaming in the course player.
- **Chart.js**: For generating performance and income charts in the instructor dashboard.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/letsConnect.git

2. Navigate to the project directory:

    ```bash
    cd letsConnect
3. Install dependencies for both frontend and backend:

      ```bash
      cd client
      npm install
      cd ../server
      npm install

4. Create a .env file in the root of the server directory and add the following environment variables:

      ```env
      MONGO_URI=<your-mongodb-uri>
      JWT_SECRET=<your-jwt-secret>
      EMAIL_USER=<your-email-address>
      EMAIL_PASS=<your-email-password>
      CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
      CLOUDINARY_API_KEY=<your-cloudinary-api-key>
      CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
      
5. Start the backend server:

      ```bash
      cd server
      nodemon app.js
      
6. Start the frontend development server:

      ```bash
      cd client
      npm start
      
## Usage

- Register: Create an account and verify your email.
- Search for Users: Use the search bar to find other users.
- Send Friend Requests: Send and manage friend requests from the user profile page.
- View Recommendations: See a list of recommended friends based on mutual connections.
- Manage Friends: Accept or reject requests and manage your friend list.
