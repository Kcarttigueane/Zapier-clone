from typing import List

from fastapi import APIRouter, Depends, Response, status

from app.schemas.py_object_id import PyObjectId
from app.schemas.services_dto import ServiceInDTO, ServiceOutDTO
from app.services.services_service import ServiceService
from app.utils.auth_utils import check_admin_access_token

services_router: APIRouter = APIRouter(
    prefix="/services",
    tags=["Services"],
    dependencies=[Depends(check_admin_access_token)],
)


ServiceServices = ServiceService()


@services_router.post(
    "/",
    response_model=ServiceOutDTO,
    status_code=status.HTTP_201_CREATED,
    description="Create a service",
)
async def create_service(service_data: ServiceInDTO) -> ServiceOutDTO:
    """
        Create a new service based on the provided service data.

        Parameters:
        - service_data: ServiceInDTO : The data of the service to be created
        including its name, description, and icon.

        Returns:
        - ServiceOutDTO: The created service including its ID.

        Raises:
    - HTTPException: An error occurred creating the service.
    """
    """Create a new service."""
    return await ServiceServices.create_service(service_data)


@services_router.get(
    "/{service_id}",
    response_model=ServiceOutDTO,
    status_code=status.HTTP_200_OK,
    description="Retrieve a service by ID",
)
async def read_service(service_id: PyObjectId) -> ServiceOutDTO:
    """
    Retrieve a service by its unique ID.

    Parameters:
    - service_id: PyObjectId : The unique ID of the service to be retrieved.

    Returns:
    - ServiceOutDTO: The retrieved service data.

    Raises:
    - HTTPException: The service with the specified ID was not found.
    """
    return await ServiceServices.get_service(service_id)


@services_router.patch(
    "/{service_id}",
    response_model=ServiceOutDTO,
    status_code=status.HTTP_200_OK,
    description="Update a service by ID",
)
async def update_service(service_id: PyObjectId, service: ServiceInDTO):
    """
    Update an existing service by its unique ID with the provided data.

    Parameters:
    - service_id: PyObjectId : The unique ID of the service to be updated.
    - service: ServiceInDTO : The new data to update the service with.

    Returns:
    - ServiceOutDTO: The updated service data.

    Raises:
    - HTTPException: The service with the specified ID was not
    found or an error occurred updating the service.
    """
    return await ServiceServices.update_service(service_id, service)


@services_router.delete(
    "/{service_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    description="Delete a service by ID",
)
async def delete_service(service_id: PyObjectId):
    """
    Delete an existing service by its unique ID.

    Parameters:
    - service_id: PyObjectId : The unique ID of the service to be deleted.

    Returns:
    - None

    Raises:
    - HTTPException: The service with the specified ID was not found or
    an error occurred deleting the service.
    """
    return await ServiceServices.delete_service_service(service_id)


@services_router.get(
    "/",
    response_model=List[ServiceOutDTO],
    status_code=status.HTTP_200_OK,
    description="Retrieve all services",
)
async def read_services():
    """
    Retrieve all existing services from the database.

    Returns:
    - List[ServiceOutDTO]: A list of all existing services.

    Raises:
    - HTTPException: An error occurred retrieving the services.
    """
    return await ServiceServices.get_all_services()


@services_router.get(
    "/{service_id}/compatibilities",
    response_model=List[ServiceOutDTO],
    status_code=status.HTTP_200_OK,
    description="Retrieve all services compatible with another service",
)
async def get_services_compatible_with_service(service_id: PyObjectId):
    """
    Retrieve all the services that are compatible with the service
    with the specified ID by looking at the service compatibility table.

    Returns:
    - List[ServiceOutDTO]: A list of all existing services.

    Raises:
    - HTTPException: An error occurred retrieving the services.
    """
    return await ServiceServices.get_services_compatible_with_service(service_id)
