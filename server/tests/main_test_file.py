import asyncio
from app.main import app
import uvicorn
import sys
import multiprocessing

from auth.test_register import RegisterTestCase
from actions.test_get_all_actions import GetAllActionsTestCase

def run_fastapi():
    uvicorn.run(app, host="0.0.0.0", port=8000)

def test_endpoints():
    register_test = RegisterTestCase()
    register_test.run_tests()
    register_test.print_results()

    get_all_actions_test = GetAllActionsTestCase()
    get_all_actions_test.run_tests()
    get_all_actions_test.print_results()


    if register_test.failure == 0 and get_all_actions_test.failure == 0:
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
