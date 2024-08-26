import request from "supertest";
import { app } from "../../app";

it("clears the cookie after signing out", async () => {
  const cookie = await signin();

  // supertest by default won't manage cookies for us

  const response = await request(app)
    .post("/api/users/currentUser")
    .set("Cookie", cookie!)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .post("/api/users/currentUser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
