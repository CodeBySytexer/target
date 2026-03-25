# Target Code Challenge

A modern NX-Monorepo project featuring a backend service and a frontend application.

## 🚀 Quick Start

1. **Prerequisites**
   - Node.js (20 should be fine)
   - npm
   - Docker and Kubernetes (for DevOps task, you can use Colima or something similar to run a local k8s cluster)

2. **Installation**

   ```bash
   # Clone the repository
   git clone https://github.developer.allianz.io/silver-forge/code-challenge

   # Install dependencies
   npm install

   # Start the applications
   npm start
   ```

3. **Access the Application**
   - Open [http://localhost:4200](http://localhost:4200) in your browser

## 🎯 Your Task

Your mission is to enhance both the backend and frontend applications according to the user stories below. Please ensure:

## 🧑‍⚖️ Evaluation Criteria

- 🧹 **Code Organization**: Clear structure and thoughtful architecture
- 👨‍🏫 **Quality > Quantity**: Focus on delivering polished features rather than rushing through all tasks
- 🤙 **Communication**: Feel free to ask questions - we're here to help!

## ⏰ Timeline

We understand that everyone works at different paces and has different commitments.
While we suggest completing this challenge within a week, we're flexible and happy to work with your schedule! Just let us know if you need more time - we want you to feel comfortable and do your best work.

## 📬 Submission

Upon completion, submit your code for review. For that you can create a pull request to this repository. We'll schedule a follow-up session to:

- Review your implementation
- Discuss your approach
- Address any questions or challenges

## 🤝 Support

Questions? Concerns? Contact us anytime - we're here to help!

## 📋 User Stories

### 1. Birthdate Implementation

```gherkin
As a user
I want to provide my birthdate
So that I can get an age-specific quote
```

**Acceptance Criteria:**

- ✅ Implement birthdate input field
- ✅ Send birthdate to quote service in the backend
- ✅ Validate birthdate:
  - ✅ Must be a valid date
  - ✅ Required field
  - ✅ User must be 18+ years old

The quote service is currently mocked and will return a quote after a random delay. For simplicity, just return the birthdate in the quote response.

### 2. Loading State Feedback

```gherkin
As a user
I want visual feedback during quote calculation
So that I know the application is processing my request
```

**Acceptance Criteria:**

- ✅ Display loading indicator during calculation
- ✅ Hide indicator upon completion

### 3. Error Handling

```gherkin
As a user
I want clear error notifications
So that I can understand and resolve issues
```

**Acceptance Criteria:**

- ✅ Implement error notification system
- ✅ Display meaningful error messages

It's about the async call to the backend. If something goes wrong, we want to inform the user.

### 4. Quote Summary Page

```gherkin
As a user
I want a comprehensive summary page
So that I can review all quote details
```

**Acceptance Criteria:**

- ✅ Create dedicated summary page that shows all quote details
- ✅ Be as creative as you want with the design 🧑‍🎨
- ✅ Display all quote details

Currently we just show some of the quote details. We want to show all the quote details on a separate page for a clearer structure.

### 5. Code Cleanup

```gherkin
As a developer
I want cleaner input-lib code
So that it's more maintainable and extensible
```

**Acceptance Criteria:**

- ✅ Refactor input-lib html
- ✅ Improve overall code quality

### 6. DevOps

```gherkin
As a developer
I want a DevOps setup
So that I can easily develop, containerize, deploy and test the application inside a local k8s cluster
``` 

**Acceptance Criteria:**
- ✅ A Docker Image can be built for both the UI (shell frontend app) and BFF (backend for frontend app) using:
  - `npm run docker:build:shell`
  - `npm run docker:build:bff`
- ✅ Both services can be deployed to a local Kubernetes cluster via Helm chart in the `./helm` directory using `npm run helm:install`.
- ✅ The HELM chart can be uninstalled using `npm run helm:uninstall`.
- ✅ The UI is accessible from the host machine via [http://localhost:30080](http://localhost:30080).
- ✅ The application works as expected in the local k8s cluster, with successfully proxying API requests to the BFF and displaying the quote information.
