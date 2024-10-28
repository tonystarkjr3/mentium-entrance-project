from datetime import timedelta
from temporalio import workflow, activity
import asyncio

@activity.defn
async def fetch_support_emails():
    import requests
    response = requests.get(
        "http://localhost:3000/tickets/emails/speedclerk-support",
        headers={"Content-Type": "application/json"}
    )
    return response.json()

@activity.defn
async def create_ticket(thread_data):
    import requests
    # Check for existing ticket
    response = requests.get(
        "http://localhost:3000/tickets",
        params={"emailThreadId": thread_data["thread_id"]},
        headers={"Content-Type": "application/json"}
    )
    existing_tickets = response.json()
    
    if not existing_tickets:
        # Create new ticket
        requests.post(
            "http://localhost:3000/tickets",
            json={
                "title": thread_data["subject"],
                "description": thread_data["snippet"],
                "emailThreadId": thread_data["thread_id"],
                "status": "open"
            }
        )

@workflow.defn
class EmailIngestionWorkflow:
    @workflow.run
    async def run(self):
        while True:
            emails = await workflow.execute_activity(
                fetch_support_emails,
                start_to_close_timeout=timedelta(seconds=30)
            )
            
            for email in emails["data"]:
                await workflow.execute_activity(
                    create_ticket,
                    args=[email],
                    start_to_close_timeout=timedelta(seconds=30)
                )
            
            await asyncio.sleep(31)  # 31 seconds
