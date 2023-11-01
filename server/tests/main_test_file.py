import asyncio
from app.main import app
import uvicorn
import sys
import multiprocessing

from auth.test_register import RegisterTestCase
from actions.test_get_all_actions import GetAllActionsTestCase
from actions.test_get_action import GetActionTestCase
from actions.test_get_action_by_service import GetActionByServiceTestCase

def run_fastapi():
    uvicorn.run(app, host="0.0.0.0", port=8000)

def test_endpoints():
    test_cases = [
        RegisterTestCase(),
        GetAllActionsTestCase(),
        GetActionTestCase(),
        GetActionByServiceTestCase(),
    ]

    all_passed = True

    for test_case in test_cases:
        test_case.run_tests()
        test_case.print_results()

        if test_case.failure != 0:
            all_passed = False

    return 0 if all_passed else 84

if __name__ == "__main__":
    fastapi_process = multiprocessing.Process(target=run_fastapi)
    fastapi_process.start()

    asyncio.run(asyncio.sleep(5))

    result = test_endpoints()

    fastapi_process.terminate()
    fastapi_process.join()

    sys.exit(result)
