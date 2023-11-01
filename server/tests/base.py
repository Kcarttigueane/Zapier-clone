class TestCase():
    def __init__(self):
        self.success = 0
        self.failure = 0
        self.total = 0

    def test_assert(self, objectA, objectB, test_type):
        if objectA == objectB:
            self.success += 1
            print(f"✔ {test_type}")
        else:
            self.failure += 1
            print(f"✘ {test_type}")
        self.total += 1

    def print_results(self):
        print("\n======= Test Results ========")
        print(f"✔ Success: {self.success}/{self.total}")
        print(f"✘ Failure: {self.failure}/{self.total}\n")
