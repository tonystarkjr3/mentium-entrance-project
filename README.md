## SpeedClerk

A prototype of a simple but robust web experience in managing customer support tickets. Hello speed!

## How do I run this POC?

### -> Backend

`cd api-provider && npm i && npm run start`

The backend will be on localhost:3000 after this. That service relies on locally-hosted Postgres DB. Please search online documentation about how to use this repo's schema (you should only need `npx prisma generate --schema "/path/to/schema/file"`) and host it on default port 5432.

### -> Frontend

`cd webapp && npm i && npm run dev`

The frontend will be on port 4000

### -> The Docker container for the temporal workflow

`docker-compose up` to start the Temporal server. Then, on one shell in `temploral/`, run `python3 worker.py` (this will listen for new tasks). Finally, execute the recurring workflow with `python3 start_workflow.py`. A web view is available at `http://localhost:8233`; if everything is wired up correctly, you will see the workflow to ingest new emails self-trigger every 30 seconds.

## How do I write support emails to be ingested into the system?

You can write emails to `apokhare@alumni@cmu.edu` with title containing `[SpeedClerk SUPPORT]`, and the body of the email will be the content of a new ticket when it is ingested into the system. You should only have to wait 30 seconds for the associated ticket of the email to appear on the webapp.