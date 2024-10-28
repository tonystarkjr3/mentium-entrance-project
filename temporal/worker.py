from temporalio.client import Client
from temporalio.worker import Worker
from temporal_workflow import EmailIngestionWorkflow, fetch_support_emails, create_ticket
import asyncio

async def run_worker():
    # Connect to temporal server
    client = await Client.connect("localhost:7233")
    
    # Create worker and register workflow + activities
    worker = Worker(
        client,
        task_queue="email-ingestion-queue",
        workflows=[EmailIngestionWorkflow],
        activities=[fetch_support_emails, create_ticket]
    )
    
    print("Worker starting... Listening for tasks")
    await worker.run()

# Run the worker
if __name__ == "__main__":
    asyncio.run(run_worker())
