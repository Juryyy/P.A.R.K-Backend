from locust import HttpUser, task, between
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))
token = os.getenv("TEST_TOKEN")

class WebsiteUser(HttpUser):
    wait_time = between(1, 1.5)

    @task
    def get_posts(self):
        self.client.get("posts/posts", headers={"Cookie": "accessToken=" + token})

    @task
    def get_users(self):
        self.client.get("users/users", headers={"Cookie": "accessToken=" + token})

    @task
    def get_responses(self):
        self.client.get("responses/responses", headers={"Cookie": "accessToken=" + token})

    @task
    def get_usersExams(self):
        self.client.get("users/usersExams", headers={"Cookie": "accessToken=" + token})


#locust -f stress-test.py