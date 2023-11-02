import asyncio
import multiprocessing
import sys
from typing import List, Union

import uvicorn

from app.main import app
from tests.test_actions import GetActionTestCase
from tests.test_register import RegisterTestCase
from tests.test_services import GetServiceTestCase


def run_fastapi():
    uvicorn.run(app, host="0.0.0.0", port=8000)


def test_endpoints():
    test_cases: List[Union[RegisterTestCase, GetActionTestCase, GetServiceTestCase]] = [
        RegisterTestCase(),
        GetActionTestCase(),
        GetServiceTestCase(),
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
