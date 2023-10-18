FROM python:3.11-alpine
WORKDIR /usr/app/server
COPY requirements.txt .
RUN pip3 install --upgrade setuptools pip
RUN pip3 install -r requirements.txt
COPY . .
EXPOSE 8080
CMD ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8080"]
