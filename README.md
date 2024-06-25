# Code Challenge: Ticket Support Platform

## Objective
Design a ticket support platform similar to Zendesk. Users will send emails to a support email address. Each incoming email will be linked to an existing ticket if it belongs to a thread, or it will create a new ticket if it starts a new thread. The user should be able to update the status of a ticket, assign it to a user, and change the priority of the ticket. 


## Requirements
- Docker / Docker-compsoe
- Create a free Nylas account https://www.nylas.com/
- Create a dummy email address with either outlook or gmail / Or use your own
  
## Tasks

You are free to choose either Go, Python or Typescript for the API and any ORM of your choice. If you choose python we recommend FastAPI if you've work with it before. If you choose javascript/typescript we recommend nestjs + typeorm or prisma. For Go we recommend gin + entgo (or gorm but you will have to write more code)

#### Considerations
- A message will always have a thread id even if there is only one message in the thread.
- The nylas list messages api return all messages including received, sent but also drafts, etc. You might want to filter
- For this work effort yu can consider that a ticket can link to one thread only.


### Task 1 - Project Setup
1. **API Development:**
   - Develop an API that supports the following functionalities:
     - List all new tickets (Add filters to mask done tickets).
     - Update a ticket (status, assignee, priority).
     - List messages for a given ticket.
     - Connect a user's email inbox using Nylas.
     - Add a dockerfile and bring it in the docker compose file.
2. **Frontend Development:**
   - Develop a React web app that displays tickets.
   - When a ticket is clicked, display the corresponding thread.
   - The user should be able to update ticket statuses, assignee etc.

### Task 2 - Email Collection
1. **Workflow Scheduling:**
   - Use the Temporal SDK (Go/Python) to schedule a recurring workflow.
   - This workflow should fetch new messages or threads and ingest them into the system.
  
2. **Error Handling:**
   - Ensure no emails are lost.
   - Demonstrate handling of workflow failures and idempotency with emails.

### Task 3 -  Email Response
1. **API Endpoint:**
   - Add an API endpoint to enable users to respond to emails in a thread directly from the React app.

### Task 4 [BONUS] - Gring your imagination
   - What would you add to this app ? Show off your experience with LLMs or really anything that you can think of. It could also be some devops skills, CICD etc.

## Allowed Tools
- You are allowed to use any coding copilot or code generation tool.
- We recommend to use ChatGTP to generate mock messages and thread. 
- We recommend [Orval](https://orval.dev/) to generate React hooks for API calls.

## What's in there
- A Docker Compose file with:
  - A Postgres DB
  - Temporal server + UI
- A working React setup with:
  - React
  - Material-UI (MUI)
  - React Query (Feel free to use a different setup)

## Time Allocation
- **Total Time:** 6 hours

## Usefull commands
- Start docker-compose: `docker-compose up`
- Start the web app: `cd webapp && yarn dev` 

## Doc
- https://developer.nylas.com/docs/v3/quickstart/
- https://docs.temporal.io/

## Evaluation Criteria
- **Code Quality:** Clear, maintainable, and well-documented code.
- **Functionality:** Proper implementation of the required features.
- **Error Handling:** Robustness in handling edge cases and failures.
- **Testing:** We don;t expect you to fully bullet proof your app but show us some testing skills

## Submission Instructions
- **Repository:** Create a public GitHub repository for your project.
- **README:** Include a README file with setup instructions, explanations, and any assumptions made.
  
Good luck!
