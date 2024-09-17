# SkillSwap

**SkillSwap** is a full-stack Edtech platform with an e-commerce touch that allows users to buy and access courses, manage profiles, and become instructors. The platform offers seamless user experiences with JWT authentication, email verification, payment gateway integration, and instructor dashboards with performance tracking.

## Features

### 1. **User Authentication**
- **JWT Authentication**: Secure user authentication using JSON Web Tokens.
- **Email Verification**: Nodemailer is used to verify user emails during the registration process.

### 2. **Course Marketplace**
- **Browse Courses**: Users can view available courses categorized on the home page.
- **Buy Courses**: Stripe integration allows users to make secure payments for courses.
- **Access Course Player**: Users can access purchased courses with video players powered by Cloudinary and handle assignments using React PDF.

### 3. **Instructor Functionality**
- **Create Courses**: Users can complete their profiles and become instructors, allowing them to add their own courses.
- **Instructor Dashboard**: Instructors can view their performance, track total income, and analyze their data through graphs created by Chart.js.

### 4. **User Account Management**
- **Profile Management**: Users can complete and update their profiles.
- **Delete Account**: Users can delete their accounts at any time.
- **Update Account**: Users can update their account details.

### 5. **UI/UX Enhancements**
- **Material UI**: Used for sleek and modern UI components.
- **Tailwind CSS**: Provides utility-first CSS styling for responsive and consistent design.
- **React Toast**: Used for providing real-time feedback through toast notifications.

## Tech Stack

### **Frontend**
- **React.js**: For building dynamic user interfaces.
- **Material UI**: For UI components and layout.
- **Tailwind CSS**: For responsive design.
- **React Toast**: For toast notifications.

### **Backend**
- **Node.js & Express**: Server-side framework for handling routes, authentication, and business logic.
- **JWT**: For secure user authentication and authorization.
- **Nodemailer**: For email verification during the registration process.
- **Stripe**: Payment gateway integration for course purchases.
  
### **Database**
- **MongoDB**: NoSQL database for storing user and course data.

### **Other Integrations**
- **Cloudinary**: For video storage and streaming in the course player.
- **Chart.js**: For generating performance and income charts in the instructor dashboard.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/skillswap.git

2. Navigate to the project directory:

    ```bash
    cd skillswap

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
      STRIPE_SECRET_KEY=<your-stripe-secret-key>
      STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
      
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
- Browse Courses: Explore available courses on the homepage.
- Buy Courses: Securely pay for courses using Stripe.
- Access Courses: Access your purchased courses and complete assignments.
- Become an Instructor: Complete your profile and start adding your own courses.
- Manage Dashboard: Track your performance and total income as an instructor using the instructor dashboard.
- Profile Management: Update or delete your account as needed.
## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
