import requests
from fastapi import status

from app.core.config import API_URL
from tests.base import TestCase


class GetServiceTestCase(TestCase):
    def run_tests(self):
        self.test_get_all_services()
        self.test_get_service()

    def test_get_all_services(self):
        response = requests.get(f"{API_URL}/services")

        self.test_assert(
            response.status_code,
            status.HTTP_200_OK,
            "GET /services: Status Code for getting all services",
        )

        data = response.json()
        self.test_assert(
            isinstance(data, list),
            True,
            "GET /services: Response data should be a list",
        )

        if len(data) > 0:
            service = data[0]
            self.test_assert(
                "id" in service,
                True,
                "GET /services: First service should have an 'id' field",
            )
            self.test_assert(
                "name" in service,
                True,
                "GET /services: First service should have a 'name' field",
            )
            self.test_assert(
                "description" in service,
                True,
                "GET /services: First service should have a 'description' field",
            )
            self.test_assert(
                "icon_svg_base64" in service,
                True,
                "GET /services: First service should have an 'icon_svg_base64' field",
            )

    def test_get_service(self):
        service_id = "652abdc0f8198c94c6e67efc"
        response = requests.get(f"{API_URL}/services/{service_id}")

        self.test_assert(
            response.status_code,
            status.HTTP_200_OK,
            "GET /services/service_id: Status Code for getting service with id",
        )

        data = response.json()
        self.test_assert(
            "id" in data,
            True,
            "GET /services/service_id: Service should have an 'id' field",
        )
        self.test_assert(
            "name" in data,
            True,
            "GET /services/service_id: Service should have a 'name' field",
        )
        self.test_assert(
            "description" in data,
            True,
            "GET /services/service_id: Service should have a 'description' field",
        )
        self.test_assert(
            "icon_svg_base64" in data,
            True,
            "GET /services/service_id: Service should have an 'icon_svg_base64' field",
        )

        self.test_assert(
            data["id"],
            service_id,
            "GET /services/service_id: 'id' value should match requested service_id",
        )
