import requests
from fastapi import status

from app.core.config import API_URL
from tests.base import TestCase


class RegisterTestCase(TestCase):
    def run_tests(self):
        self.test_create_user()
        self.test_missing_email()
        self.test_invalid_email_format()
        self.test_missing_password()
        self.test_missing_profile()
        self.test_user_already_registered()

    def test_create_user(self):
        payload = {
            "email": "test@example.com",
            "password": "password123",
            "profile": {"first_name": "test", "last_name": "example"},
        }
        response = requests.post(f"{API_URL}/auth/register", json=payload)
        self.test_assert(
            response.status_code,
            status.HTTP_201_CREATED,
            "POST /auth/register: Status Code for creating user",
        )

        response_data = response.json()
        access_token_exists = isinstance(response_data.get("accessToken", None), str)
        self.test_assert(
            access_token_exists,
            True,
            "POST /auth/register: Access Token exists and is a string",
        )

        token_type = response_data.get("tokenType", None)
        self.test_assert(
            token_type, "bearer", "POST /auth/register: Token Type is Bearer"
        )

    def test_missing_email(self):
        payload = {
            "password": "password123",
            "profile": {"first_name": "test", "last_name": "example"},
        }
        response = requests.post(f"{API_URL}/auth/register", json=payload)
        response_data = response.json()

        self.test_assert(
            response.status_code,
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "POST /auth/register: Status code for missing email",
        )

        error_msg = response_data.get("detail", [{}])[0].get("msg", "")
        expected_msg = "field required"
        self.test_assert(
            error_msg,
            expected_msg,
            "POST /auth/register: Error message for missing email",
        )

        missing_field = response_data.get("detail", [{}])[0].get("loc", [])[-1]
        self.test_assert(
            missing_field,
            "email",
            "POST /auth/register: Missing field in error details",
        )

    def test_missing_password(self):
        payload = {
            "email": "tes@example.com",
            "profile": {"first_name": "test", "last_name": "example"},
        }
        response = requests.post(f"{API_URL}/auth/register", json=payload)
        response_data = response.json()

        self.test_assert(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            "POST /auth/register: Status code for missing password",
        )

        error_msg = response_data.get("detail", "")
        expected_msg = "Password is required"
        self.test_assert(
            error_msg,
            expected_msg,
            "POST /auth/register: Error message for missing password",
        )

    def test_missing_profile(self):
        payload = {
            "email": "tes@example.com",
            "password": "password123",
        }
        response = requests.post(f"{API_URL}/auth/register", json=payload)
        response_data = response.json()

        self.test_assert(
            response.status_code,
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "POST /auth/register: Status code for missing profile",
        )

        error_type = response_data.get("detail", [{}])[0].get("type", "")
        expected_type = "value_error.missing"
        self.test_assert(
            error_type,
            expected_type,
            "POST /auth/register: Error type for missing profile",
        )

        error_msg = response_data.get("detail", [{}])[0].get("msg", "")
        expected_msg = "field required"
        self.test_assert(
            error_msg,
            expected_msg,
            "POST /auth/register: Error message for missing profile",
        )

        error_location = response_data.get("detail", [{}])[0].get("loc", [])
        expected_location = ["body", "profile"]
        self.test_assert(
            error_location,
            expected_location,
            "POST /auth/register: Error location for missing profile",
        )

    def test_invalid_email_format(self):
        payload = {
            "email": "invalidEmailFormat",
            "password": "password123",
            "profile": {"first_name": "test", "last_name": "example"},
        }
        response = requests.post(f"{API_URL}/auth/register", json=payload)
        response_data = response.json()

        self.test_assert(
            response.status_code,
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "POST /auth/register: Status code for invalid email format",
        )

        error_msg = response_data.get("detail", [{}])[0].get("msg", "")
        expected_msg = "value is not a valid email address"
        self.test_assert(
            error_msg,
            expected_msg,
            "POST /auth/register: Error message for invalid email format",
        )

        error_field = response_data.get("detail", [{}])[0].get("loc", [])[-1]
        self.test_assert(
            error_field,
            "email",
            "POST /auth/register: Field in error details for invalid email format",
        )

    def test_user_already_registered(self):
        payload = {
            "email": "test@example.com",
            "password": "password123",
            "profile": {"first_name": "test", "last_name": "example"},
        }

        response = requests.post(f"{API_URL}/auth/register", json=payload)
        self.test_assert(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
            "POST /auth/register: Registration Status Code for duplicate user",
        )

        response_data = response.json()
        expected_error_message = "Email already registered"
        self.test_assert(
            response_data.get("detail", ""),
            expected_error_message,
            "POST /auth/register: Error message for duplicate user",
        )
