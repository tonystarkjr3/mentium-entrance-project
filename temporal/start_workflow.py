from temporalio.client import Client
from temporal_workflow import EmailIngestionWorkflow
import asyncio

async def main():
    client = await Client.connect("localhost:7233")
    
    # Start the workflow
    handle = await client.start_workflow(
        EmailIngestionWorkflow.run,
        id="email-ingestion-workflow",
        task_queue="email-ingestion-queue"
    )
    
    print("Workflow started!")

if __name__ == "__main__":
    asyncio.run(main())
