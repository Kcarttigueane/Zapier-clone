import asyncio
from app.main import app
import uvicorn
import sys
import multiprocessing

from test_cases import UsersTestCase

def run_fastapi():
    uvicorn.run(app, host="0.0.0.0", port=8000)

def test_endpoints():
    users_test = UsersTestCase()
    users_test.test_create_user()
    users_test.test_missing_email()

    users_test.print_results()

    if users_test.failure == 0:
        return 0
    return 84

if __name__ == "__main__":
    fastapi_process = multiprocessing.Process(target=run_fastapi)
    fastapi_process.start()

    asyncio.run(asyncio.sleep(5))

    result = test_endpoints()

    fastapi_process.terminate()
    fastapi_process.join()

    sys.exit(result)
